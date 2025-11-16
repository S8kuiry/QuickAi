import OpenAI from "openai";
import { clerkClient } from "@clerk/express";
import sql from "../configs/db.js";
import dotenv from "dotenv";
import axios from "axios";
import { InferenceClient } from "@huggingface/inference";
import cloudinary from "../configs/cloudinary.js";
import fs from "fs";
import pdf from "pdf-parse/lib/pdf-parse.js";

dotenv.config();

const HF_CLIENT = new InferenceClient(process.env.HUGGINGFACE_API_KEY);

const AI = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

const incrementFreeUsage = async (userId, free_usage) => {
  await clerkClient.users.updateUserMetadata(userId, {
    privateMetadata: {
      free_usage: free_usage + 1,
    },
  });
};

export const generateArticle = async (req, res) => {
  try {
    const { userId, plan, free_usage } = req;
    const { prompt, length } = req.body;

    if (plan !== "premium" && free_usage >= 10) {
      return res.json({
        success: false,
        message: "Limit Reached. Upgrade to premium to continue",
      });
    }

    const response = await AI.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: length,
    });

    const content = response.choices[0].message.content;

    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, ${prompt}, ${content}, 'article')
    `;

    if (plan !== "premium") await incrementFreeUsage(userId, free_usage);

    res.json({ success: true, content });
  } catch (error) {
    console.error("AI generation error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const generateBlogTitle = async (req, res) => {
  try {
    const { userId, plan, free_usage } = req;
    const { prompt } = req.body;

    if (plan !== "premium" && free_usage >= 10) {
      return res.json({
        success: false,
        message: "Limit Reached. Upgrade to premium to continue",
      });
    }

    const response = await AI.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 100,
    });

    const content = response.choices[0].message.content;

    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, ${prompt}, ${content}, 'blog-title')
    `;

    if (plan !== "premium") await incrementFreeUsage(userId, free_usage);

    res.json({ success: true, content });
  } catch (error) {
    console.error("AI generation error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const generateImage = async (req, res) => {
  try {
    const { userId, plan, free_usage } = req;
    const { prompt, publish } = req.body;

    if (plan !== "premium" && free_usage >= 10) {
      return res.json({
        success: false,
        message: "Limit Reached. Upgrade to premium to continue",
      });
    }

    const formData = new FormData();
    formData.append("prompt", prompt);

    const { data } = await axios.post(
      "https://clipdrop-api.co/text-to-image/v1",
      formData,
      {
        headers: { "x-api-key": process.env.CLIPDROP_API },
        responseType: "arraybuffer",
      }
    );

    const base64Image = `data:image/png;base64,${Buffer.from(
      data,
      "binary"
    ).toString("base64")}`;

    const { secure_url } = await cloudinary.uploader.upload(base64Image);

    await sql`
      INSERT INTO creations (user_id, prompt, content, type, publish)
      VALUES (${userId}, ${prompt}, ${secure_url}, 'image', ${publish ?? false})
    `;

    if (plan !== "premium") await incrementFreeUsage(userId, free_usage);

    res.json({ success: true, content: secure_url });
  } catch (error) {
    console.error("Image Generation Error:", error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: error.response?.data?.error || error.message,
    });
  }
};

export const removeImageBackground = async (req, res) => {
  try {
    const { userId, plan, free_usage } = req;
    const image = req.file;

    if (!image)
      return res.status(400).json({ success: false, message: "No image uploaded" });

    if (plan !== "premium" && free_usage >= 10) {
      return res.json({
        success: false,
        message: "Limit Reached. Upgrade to premium to continue",
      });
    }

    const { secure_url } = await cloudinary.uploader.upload(image.path, {
      transformation: [{ effect: "background_removal" }],
    });

    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, 'Removed background from image', ${secure_url}, 'image')
    `;

    if (plan !== "premium") await incrementFreeUsage(userId, free_usage);

    res.json({ success: true, content: secure_url });
  } catch (error) {
    console.error("Background Removal Error:", error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: error.response?.data?.error || error.message,
    });
  }
};

export const removeImageObject = async (req, res) => {
  try {
    const { userId, plan, free_usage } = req;
    const { object } = req.body;
    const image = req.file;

    if (!image)
      return res.status(400).json({ success: false, message: "No image uploaded" });

    if (!object)
      return res.status(400).json({ success: false, message: "No object specified" });

    if (plan !== "premium" && free_usage >= 10) {
      return res.json({
        success: false,
        message: "Limit Reached. Upgrade to premium to continue",
      });
    }

    const { secure_url } = await cloudinary.uploader.upload(image.path, {
      transformation: [{ effect: `gen_remove:${object}` }],
    });

    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, ${`Removed ${object} from image`}, ${secure_url}, 'image')
    `;

    if (plan !== "premium") await incrementFreeUsage(userId, free_usage);

    res.json({ success: true, content: secure_url });
  } catch (error) {
    console.error("Object Removal Error:", error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: error.response?.data?.error || error.message,
    });
  }
};

export const resumeReview = async (req, res) => {
  try {
    const { userId, plan, free_usage } = req;
    const resume = req.file;

    if (!resume) {
      return res.status(400).json({ success: false, message: "No resume uploaded" });
    }

    if (plan !== "premium" && free_usage >= 10) {
      return res.json({
        success: false,
        message: "Limit Reached. Upgrade to premium to continue",
      });
    }

    if (resume.size > 5 * 1024 * 1024) {
      return res.json({
        success: false,
        message: "Resume file exceeds 5MB",
      });
    }

    const databuffer = fs.readFileSync(resume.path);
    const pdfData = await pdf(databuffer);

    const prompt = `Review the following resume and provide constructive feedback on strengths, weaknesses, and areas for improvement.\n\n${pdfData.text}`;

    const response = await AI.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const content = response.choices[0].message.content;

    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, 'Resume review', ${content}, 'resume-review')
    `;

    if (plan !== "premium") await incrementFreeUsage(userId, free_usage);

    res.json({ success: true, content });
  } catch (error) {
    console.error("Resume Review Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

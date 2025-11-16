import OpenAI from "openai"
import { clerkClient } from "@clerk/express"
import sql from "../configs/db.js"
import dotenv from 'dotenv'
import axios from "axios"
import { InferenceClient } from "@huggingface/inference";
import cloudinary from "../configs/cloudinary.js";
import fs from 'fs'
import pdf from 'pdf-parse/lib/pdf-parse.js'

const HF_CLIENT = new InferenceClient(process.env.HUGGINGFACE_API_KEY);


dotenv.config()

const AI = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
})

export const generateArticle = async (req, res) => {
  try {
    const { userId } = req.auth()
    const { prompt, length } = req.body
    const { plan, free_usage } = req

    if (plan !== 'premium' && free_usage >= 10) {
      return res.json({
        success: false,
        message: "Limit Reached. Upgrade to premium to continue"
      })
    }

    const response = await AI.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: length
    })

    const content = response.choices[0].message.content

    await sql`
      INSERT INTO creations (user_id, prompt, content, type) 
      VALUES (${userId}, ${prompt}, ${content}, 'article')
    `

    if (plan !== 'premium') {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          free_usage: free_usage + 1
        }
      })
    }

    res.json({ success: true, content })

  } catch (error) {
    console.error("AI generation error:", error)
    res.status(500).json({ success: false, message: error.message })
  }
}

export const generateBlogTitle = async (req, res) => {
  try {
    const { userId } = req.auth()
    const { prompt} = req.body
    const { plan, free_usage } = req

    if (plan !== 'premium' && free_usage >= 10) {
      return res.json({
        success: false,
        message: "Limit Reached. Upgrade to premium to continue"
      })
    }

    const response = await AI.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 100
    })

    const content = response.choices[0].message.content

    await sql`
      INSERT INTO creations (user_id, prompt, content, type) 
      VALUES (${userId}, ${prompt}, ${content}, 'blog-title')
    `

    if (plan !== 'premium') {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          free_usage: free_usage + 1
        }
      })
    }

    res.json({ success: true, content })

  } catch (error) {
    console.error("AI generation error:", error)
    res.status(500).json({ success: false, message: error.message })
  }
}



export const generateImage = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { prompt, publish } = req.body;
    const { plan, free_usage } = req;

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
        headers: {
          "x-api-key": process.env.CLIPDROP_API,
        },
        responseType: "arraybuffer",
      }
    );

    const base64Image = `data:image/png;base64,${Buffer.from(data, "binary").toString("base64")}`;

    // ✅ Upload to Cloudinary first
    const { secure_url } = await cloudinary.uploader.upload(base64Image);

    // ✅ Now insert into database
    await sql`
      INSERT INTO creations (user_id, prompt, content, type, publish)
      VALUES (${userId}, ${prompt}, ${secure_url}, 'image', ${publish ?? false})
    `;

    if (plan !== "premium") {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          free_usage: free_usage + 1,
        },
      });
    }

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
    const { userId } = req.auth();
    const image = req.file;
    const { plan, free_usage } = req;

    if (plan !== "premium" && free_usage >= 10) {
      return res.json({
        success: false,
        message: "Limit Reached. Upgrade to premium to continue",
      });
    }

    // Upload image first
    const { secure_url } = await cloudinary.uploader.upload(image.path, {
      transformation: [
        {
          effect: "background_removal",
        },
      ],
    });

    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, 'Removed background from image', ${secure_url}, 'image')
    `;

    if (plan !== "premium") {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          free_usage: free_usage + 1,
        },
      });
    }

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
    const { userId } = req.auth();
    const { object } = req.body;
    const image = req.file;
    const { plan, free_usage } = req;

    if (plan !== "premium" && free_usage >= 10) {
      return res.json({
        success: false,
        message: "Limit Reached. Upgrade to premium to continue",
      });
    }

    // Upload image and apply object removal during upload
    const { secure_url } = await cloudinary.uploader.upload(image.path, {
      transformation: [
        { effect: `gen_remove:${object}` }
      ]
    });

    // Save to database
    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, ${`Removed ${object} from image`}, ${secure_url}, 'image')
    `;

    // Increment usage if not premium
    if (plan !== "premium") {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          free_usage: free_usage + 1,
        },
      });
    }

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
    const { userId } = req.auth;
    const resume = req.file;

    if (!resume) {
      return res.status(400).json({ success: false, message: 'No resume file uploaded' });
    }

    const user = await clerkClient.users.getUser(userId);
    const plan = user.privateMetadata?.plan || 'free';
    const free_usage = user.privateMetadata?.free_usage || 0;

    if (plan !== 'premium' && free_usage >= 10) {
      return res.json({
        success: false,
        message: 'Limit Reached. Upgrade to premium to continue',
      });
    }

    if (resume.size > 5 * 1024 * 1024) {
      return res.json({
        success: false,
        message: 'Resume file size exceeds allowed size (5MB)',
      });
    }

    const databuffer = fs.readFileSync(resume.path);
    const pdfData = await pdf(databuffer);

    const prompt = `Review the following resume and provide constructive feedback on its strengths, weaknesses, and areas for improvement.\n\nResume Content:\n${pdfData.text}`;

    const response = await AI.chat.completions.create({
      model: 'gemini-2.0-flash',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const content = response.choices[0].message.content;

    // Save result to DB
    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, 'Resume review', ${content}, 'resume-review')
    `;

    if (plan !== 'premium') {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          free_usage: free_usage + 1,
        },
      });
    }

    res.json({ success: true, content });
  } catch (error) {
    console.error('Resume Review Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Something went wrong',
    });
  }
}; based on this fix and regnerate entire code

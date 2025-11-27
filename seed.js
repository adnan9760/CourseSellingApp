const mongoose = require("mongoose");
const Tag = require("./Model/Tag"); 

const tags = [
  { name: "Software Engineer", description: "" },
  { name: "Full Stack Developer", description: "" },
  { name: "Frontend Developer", description: "" },
  { name: "Backend Developer", description: "" },
  { name: "React", description: "" },
  { name: "Node.js", description: "" },
  { name: "JavaScript", description: "" },
  { name: "System Design", description: "" },
  { name: "Data Structures", description: "" },
  { name: "Algorithms", description: "" },
  { name: "MongoDB", description: "" },
  { name: "SQL", description: "" },
  { name: "Placement Prep", description: "" },
  { name: "Coding Interview", description: "" },
  { name: "DevOps", description: "" },
  { name: "Machine Learning", description: "" },
];

async function seedTags() {
  try {
    await mongoose.connect("mongodb+srv://ak9760049:qYgvcDeG7m8A9oE3@mega.txjwivs.mongodb.net/?retryWrites=true&w=majority&appName=mega");

    console.log("MongoDB Connected");

    // Optional: Clear previous data
    await Tag.deleteMany({});
    console.log("Old Tags Removed");

    // Insert new data
    const inserted = await Tag.insertMany(tags);
    console.log("Tags Inserted:", inserted.length);

    process.exit();
  } catch (error) {
    console.error("Error seeding tags:", error);
    process.exit(1);
  }
}

seedTags();

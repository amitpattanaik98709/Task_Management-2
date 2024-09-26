const express = require("express");
const app = express();
const db = require("./db");
const cors = require("cors");
const User = require("./models/User");
const Userlists = require("./models/Userlists");
const jwt = require("jsonwebtoken");

app.use(express.json());
app.use(cors());

app.post("/", async (req, res) => {
  console.log(req.body);
  try {
    const { email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Email already in use" });
    }

    // Save new user
    const newdata = new User({ email, password });
    console.log("done");

    await newdata.save();
    console.log("data saved");

    const data1 = {
      user: {
        id: newdata.id,
      },
    };
    const token = jwt.sign(data1, "secret_task");
    console.log("token created");

    return res.json({ success: true, token, email });
  } catch (error) {
    console.error("Error occurred:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Please Enter Email and Password" });
    }
    const response = await User.findOne({ email });
    console.log(response);
    if (!response) {
      return res
        .status(401)
        .json({ success: false, message: "Please Enter a correct Email" });
    }
    const ispassword = response.password === password;
    if (!ispassword) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid Password" });
    } else {
      if (ispassword) {
        const data = {
          user: {
            id: response.id,
          },
        };
        const token = jwt.sign(data, "secret_ecom");
        res.json({ success: true, token, email });
      }
    }
  } catch (error) {
    return res.status(500).json(error);
  }
});

app.post("/NewList", async (req, res) => {
  try {
    const { list, email } = req.body;
    console.log(list, email);

    if (!list) {
      return res.status(400).json({ message: "List field is required" });
    }

    const response = new Userlists({ email, list });

    console.log("data created");

    await response.save();

    console.log("data saved");

    return res.status(200).json({ message: "Successful" });
  } catch (error) {
    console.error("Error occurred:", error);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
});

app.post("/Newtask", async (req, res) => {
  const { task, list } = req.body;
  
  try {
    const response = await Userlists.find({ list });
    console.log(response);
    response[0].tasks.push(task);
    await response[0].save();
    console.log("data saved");
    return res.status(200).json("Successful");
  } catch (error) {
    return res.status(500).json(error);
  }
});

app.get("/Lists", async (req, res) => {

  const email = req.query.email; 

  try {
    const data = await Userlists.find({email:email});
    
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json(error);
  }
});
app.get("/Listsdata", async (req, res) => {

  const list = req.query.list; 

  
  try {
    const data = await Userlists.find({list:list});
    
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json(error);
  }
});

app.delete("/Lists", async (req, res) => {
  try {
    const  list  = req.query.list;
    console.log(list," list to be deleted");
    
    const response = await Userlists.findOneAndDelete({ list});
    if (response) {
      res.status(200).json({ message: "Item deleted", deletedItem: response });
    } else {
      res.status(404).json({ message: "List not found" });
    }
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/delete/sublist", async (req, res) => {
  try {
    const { task, list } = req.body;

    const response = await Userlists.findOne({ list });
    console.log(response);
    
    const arr = response.tasks;
    console.log(arr);
    const newarr = arr.filter((item) => item !== task);
    console.log(newarr);
    response.tasks = newarr;
    await response.save();

    res.status(200).json("Task successfully deleted");
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.listen(3000, () => {
  console.log("Server is running in port 3000");
});

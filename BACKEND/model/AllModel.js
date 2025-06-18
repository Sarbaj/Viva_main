import express from 'express'
import dotenv from 'dotenv';
import mongoose from 'mongoose';
dotenv.config();
const JWT_SECRET =process.env.JWT_SECRET || 'SarbaxIdGreatDevloper2499'
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            maxLength: 30,
            minLength: 2,
        },
        email: {
            type: String,
            trim: true,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        ennumber:{
          type: String,
          required: true  
        },
        role:String,
    },
    {timestamps: true}
);


const syllabusSchema = new mongoose.Schema({
  classCode: String,
  topics: String
});

const classSchema = new mongoose.Schema({
  code: { type: String, unique: true },
  teacher: String,
  classname:String
});

const classSchemaDetail = new mongoose.Schema({
  code: { type: String,unique:false},
  student: String
});


const vivaSchema = new mongoose.Schema({
  title:String,
  classCode: String,
  date: String,
  totalquetions:String,
  time:String,
  syllabus:String,
  status:String
});

const resultSchema = new mongoose.Schema({
  classCode:String,
  student:String,
  vivaId: String,
  vivaq:[],
  answers: [],
  active:Boolean,
  score: Number
});


const User = mongoose.model('User', userSchema);
const syllabusModel = mongoose.model('Syllabuse', syllabusSchema);
const classModel = mongoose.model('classDetail', classSchema);
const vivaModel = mongoose.model('viva', vivaSchema);
const resultModel = mongoose.model('vivaresult', resultSchema);
const classStudent = mongoose.model('classstudent', classSchemaDetail);
export  {User,classModel,syllabusModel,vivaModel,classStudent,resultModel};   
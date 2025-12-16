
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');


const app = express();
const port = 3000; 


app.use(bodyParser.urlencoded({ extended: true }));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});


app.post('/calculate-bmi', (req, res) => {
    
    const weight = parseFloat(req.body.weight); 
    const height = parseFloat(req.body.height); 

    if (isNaN(weight) || isNaN(height) || height <= 0 || weight <= 0) {
        return res.status(400).send(`
            <script>
                alert('Error: Invalid inputs. Please enter positive numbers for weight and height.');
                window.location.href = '/';
            </script>
        `);
    }

    // BMI = weight / height
    const bmi = weight / (height * height);
    const roundedBmi = bmi.toFixed(2); 

    
    let category = '';
    let colorClass = '';

    if (bmi < 18.5) { // Underweight: BMI < 18.5 
        category = 'Underweight'; 
        colorClass = 'underweight'; 
    } else if (bmi < 25) { // Normal weight: 18.5 <= BMI < 24.9 
        category = 'Normal weight'; 
        colorClass = 'normal'; 
    } else if (bmi < 30) { // Overweight: 25 <= BMI < 29.9 
        category = 'Overweight'; 
        colorClass = 'overweight'; 
    } else { // Obese: BMI >= 30 
        category = 'Obese'; 
        colorClass = 'obese'; 
    }

   
    const resultHtml = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <title>Your BMI Result</title>
            <style>
                /* Styles copied from index.html for result page */
                body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background-color: #f4f4f9; }
                .container { max-width: 400px; margin: 0 auto; padding: 30px; background-color: white; border-radius: 10px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); }
                h1 { color: #007bff; margin-bottom: 25px; }
                button { margin-top: 20px; padding: 10px 20px; background-color: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer; text-decoration: none; display: inline-block; font-size: 1.1em; transition: background-color 0.3s; }
                button:hover { background-color: #0056b3; }
                .result { margin-top: 25px; padding: 20px; border-radius: 8px; font-size: 1.1em; font-weight: bold; }
                .bmi-value { font-size: 2.2em; font-weight: bold; margin: 5px 0; }
                .normal { background-color: #d4edda; color: #155724; }
                .overweight { background-color: #fff3cd; color: #856404; }
                .underweight { background-color: #bee5eb; color: #0c5460; }
                .obese { background-color: #f8d7da; color: #721c24; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Your BMI Result</h1>
                <div class="result ${colorClass}">
                    <p>Body Mass Index (BMI):</p>
                    <p class="bmi-value">${roundedBmi}</p>
                    <p>Category: <b>${category}</b></p>
                </div>
                <a href="/"><button>Calculate Again</button></a>
            </div>
        </body>
        </html>
    `;
    
    res.send(resultHtml);
});


app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
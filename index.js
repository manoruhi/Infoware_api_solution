const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const port = 3000;

// Parse the requests of content-type 'application/json'
app.use(bodyParser.json());

// Create the MySQL connection pool
const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'infoware_db',
    port: 3306
});

// CREATE EMPLOYEE OPERATION
app.post('/create_employee', (req, res) => {
    const { full_name, job_title, phone_no, email, address, city, state, primary_name, primary_contact, primary_relation, secondary_name, secondary_contact, secondary_relation } = req.query;
    console.log(req.query);
    pool.query('INSERT INTO employee (FullName, JobTitle, PhoneNo, Email, Address, City, State, PrimaryContactName, PrimaryContactNo, PrimaryContactRelation, SecondaryContactName, SecondaryContactNo, SecondaryContactRelation) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [full_name, job_title, phone_no, email, address, city, state, primary_name, primary_contact, primary_relation, secondary_name, secondary_contact, secondary_relation], (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).send('Error creating user');
        } else {
            res.status(200).send('User is created successfully');
        }
    });
});

// READ EMPLOYEES OPERATION
app.get('/get_employees', (req, res) => {
    pool.query('SELECT * FROM employee', (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).send('Error retrieving users');
        } else {
            res.status(200).json(results);
        }
    });
});

// READ OPERATION OF EMPLOYEE INFORMATION BY ID
app.get('/get_employee/:id', (req, res) => {
    const id = req.params.id;
    pool.query('SELECT * FROM employee WHERE Id = ?', [id] ,(error, results) => {
        if (error) {
            console.error(error);
            res.status(500).send('Error retrieving users');
        } else {
            if( results.length === 0){
                res.status(200).send('No Entry Available');
            }
            else{
                res.status(200).json(results);
            }
        }
    });
});

// UPDATE OPERATION BY ID
app.put('/update_employee/:id', (req, res) => {
    const id = req.params.id;
    pool.query('UPDATE employee SET FullName = ?, JobTitle = ?, PhoneNo = ?, Email = ?, Address = ?, City = ?, State = ?, PrimaryContactName = ?, PrimaryContactNo = ?, PrimaryContactRelation = ?, SecondaryContactName = ?, SecondaryContactNo = ?, SecondaryContactRelation = ? WHERE id = ?', [req.body.FullName, req.body.JobTitle, req.body.PhoneNo, req.body.Email, req.body.Address, req.body.City, req.body.State, req.body.PrimaryContactName, req.body.PrimaryContactNo, req.body.PrimaryContactRelation, req.body.SecondaryContactName, req.body.SecondaryContactNo, req.body.SecondaryContactRelation, id], (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).send('Error updating user');
    } else {
        res.status(200).send('User updated successfully');
    }
    });

});

// DELETE OPERATION OF EMPLOYEE BY ID
app.delete('/delete_employee/:id', (req, res) => {
    const id = req.params.id;

    pool.query('DELETE FROM employee WHERE Id = ?', [id], (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).send('Error deleting user');
    } else {
        res.status(200).send('User deleted successfully');
    }
    });
});

// PAGINATION LOGIC (Pagination of 2)
app.get('/employee/:page', (req, res) => {
    const page = req.params.page;

    pool.query('SELECT * from employee LIMIT 2 OFFSET ?', [(page-1)*2], (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).send('Error while paginating');
    } else {
        res.status(200).send(results);
    }
    });
});


// Start a server
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
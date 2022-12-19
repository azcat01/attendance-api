const { nanoid } = require('nanoid');
const knex = require("../database/knex");
const bcrypt = require('bcrypt');

const createAccount = async (req, res, next) => {
  try {
    const encryptedPassword = await bcrypt.hash(req.body.password, 10)
    const data = await knex.insert([{
        ...req.body,
      password: encryptedPassword
    }]).into("user");

    await knex.insert([{
      nim : req.body.nim,
      present: 'off',
      time: '0'
    }]).into('attendanceTable');

    return res.status(201).json({
      status: "Success",
      message: "Account has been created",
    });

  } catch (error) {
    return res.status(500).json({
      status: "Failed",
      message: error.sqlMessage
    });
  }
}

const getAccount = async (req, res, next) => {
  try {
    const data = await knex.select('nim', knex.raw('CONCAT(firstName, \' \', lastName) as name'), 
    'angkatan', 
    'jurusan', 
    'email')
    .from('user');
    const isDataExist = data[0] !== undefined;

    if(isDataExist) {
      return res.json({
        status: "Success",
        message: "List Account",
        data: data
      });
    } else {
      return res.status(404).json({
        status: "Failed",
        message: "Data is empty"
      });
    }

  } catch (error) {
    return res.status(500).json({
      status: "Failed",
      message: error.sqlMessage || "Server Error"
    });
  }
}

const deleteAccount = async (req, res, next) => {
  try {
    const { nim } = req.body;
    const data = await knex.from('user').where('nim', nim).del();
    
    if(data) {
      return res.json({
        status: "Success",
        message: `${data} row has been affected`
      })
    } else {
      return res.status(404).json({
        status: "Failed",
        message: "NIM doesn't exists"
      })
    }

  } catch (error) {
    return res.status(500).json({
      status: "Failed",
      message: error.sqlMessage || "Server Error"
    });
  }
}

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await knex.select('email', 'password')
    .from('user')
    .where('email', email);

    let verify = false;
    if(user[0] !== undefined) {
      verify = await bcrypt.compare(password, user[0].password);
  
    } else {
      return res.status(404).json({
        status: "Failed",
        message: "Email doesn't exists"
      });
    }

    if(verify) {
      return res.status(200).json({
        status: "Success",
        message: "Login Successfully",
      });
    } else {
      return res.json({
        status: "Failed",
        message: "Wrong Password"
      });
    }

  } catch (error) {
    return res.status(500).json({
      status: "Failed",
      message: "Server Error"
    });
  }
}

const changePassword = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const encryptedPassword = await bcrypt.hash(password, 10);
    const user = await knex.select('email', 'password').from('user');

    if(user[0] !== undefined) {
      const status = knex.from('user')
      .where('email', email)
      .update('password', encryptedPassword);
      
      return res.status(201).json({
        status: "Success",
        message: "Password has been changed"
      });
    } else {
      return res.status(404).json({
        status: "Failed",
        message: "User doesn't exists"
      });
    }
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "Failed",
      message: error.sqlMessage || "Server Error"
    });
  }
}

const getAccountByNIM = async (req, res, next) => {
  try {
    const { nim } = req.params;
    const data = await knex.select(
      'nim', 
      knex.raw('CONCAT(firstName, \' \', lastName) as name'), 
      'angkatan', 
      'jurusan', 
      'email')
      .from('user')
      .where('nim', nim);
    
    if(data[0] !== undefined) {
      return res.json({
        status: "Success",
        message: "User Data",
        data: data
      });      
    } else {
      return res.json({
        status: "Failed",
        message: "User not found",
      });     
    }

  } catch (error) {
    return res.status(500).json({
      status: "Failed",
      message: error.sqlMessage || "Server Error"
    });
  }
}

const presentAttendance = async (req, res, next) => {
  try {
    const time = new Date().toString();
    const { nim, present } = req.body;
    
    await knex.from('attendanceTable')
    .where('nim', nim)
    .update({present: present, time: time});

    return res.status(200).json({
      status: "Success",
      message: "Attend"
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "Failed",
      message: error.sqlMessage || "Server Error"
    });
  }
};

const getAttendance = async (req, res, next) => {
  try {
    const {present, nim} = req.query;
    let data = await knex.select(
      knex.raw('CONCAT(firstName, \' \', lastName) as name'), 
      'jurusan',
      'angkatan',
      'present',
      'time')
      .from('attendanceTable')
      .join('user', 'user.nim','=', 'attendanceTable.nim');
    
    if(present !== undefined) {
      data = await knex.select(
        knex.raw('CONCAT(firstName, \' \', lastName) as name'), 
        'jurusan',
        'angkatan',
        'present',
        'time')
        .from('attendanceTable')
        .where('present', present)
        .join('user', 'user.nim','=', 'attendanceTable.nim');
        

      return res.json({
        status: "Success",
        message: "List Attendance",
        data: data
      });
    }

    if(nim !== undefined) {
      data = await knex.select(
        knex.raw('CONCAT(firstName, \' \', lastName) as name'), 
        'jurusan',
        'angkatan',
        'present',
        'time')
        .from('attendanceTable')
        .where('user.nim', nim)
        .join('user', 'user.nim','=', 'attendanceTable.nim');
        
      return res.json({
        status: "Success",
        message: "Attendance",
        data: data
      });
    }    

    return res.json({
      status: "Success",
      message: "List Attendance",
      data: data
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "Failed",
      message: error.sqlMessage || "Server Error"
    });
  }
};

const resetAttendance = async (req, res, next) => {
  try {
    const data = await knex('attendanceTable').column('present').update('present', 'off');
    await knex('attendanceTable').column('time').update('time', '0');

    return res.json({
      status: "Success",
      message: `${data} row has been affected`,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "Failed",
      message: error.sqlMessage || "Server Error"
    });
  }
};

module.exports = {
  createAccount,
  getAccount,
  getAccountByNIM,
  deleteAccount,
  login,
  changePassword,
  presentAttendance,
  getAttendance,
  resetAttendance
}
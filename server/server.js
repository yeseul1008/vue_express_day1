const express = require('express');
const cors = require('cors');
const path = require('path');
const oracledb = require('oracledb');

const app = express();
app.use(cors());

// ejs 설정
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '.')); // .은 경로

const config = {
  user: 'SYSTEM',
  password: 'test1234',
  connectString: 'localhost:1521/xe'
};

// Oracle 데이터베이스와 연결을 유지하기 위한 전역 변수
let connection;

// 데이터베이스 연결 설정
async function initializeDatabase() {
  try {
    connection = await oracledb.getConnection(config);
    console.log('Successfully connected to Oracle database');
  } catch (err) {
    console.error('Error connecting to Oracle database', err);
  }
}

initializeDatabase();

// 엔드포인트
app.get('/', (req, res) => {
  res.send('Hello World');
});

app.get('/emp/list', async (req, res) => { // /emp/list: 주소 이름
  const { } = req.query;
  try {
    const result = await connection.execute(`SELECT * FROM EMP E LEFT JOIN DEPT D ON E.DEPTNO = D.DEPTNO ORDER BY SAL DESC`);
    const columnNames = result.metaData.map(column => column.name);
    // 쿼리 결과를 JSON 형태로 변환
    const rows = result.rows.map(row => {
      // 각 행의 데이터를 컬럼명에 맞게 매핑하여 JSON 객체로 변환
      const obj = {};
      columnNames.forEach((columnName, index) => {
        obj[columnName] = row[index];
      });
      return obj;
    });
    // 리턴 (맵 형태로)
    res.json({ // 코드가 성공적으로 실행됐을때 이 코드를 보내줌
        result : "success",
        empList : rows // 해당 이름으로 value를 보내줌
    });
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).send('Error executing query');
  }
});

app.get('/emp/info', async (req, res) => { // /emp/list: 주소 이름
  const { empNo } = req.query;
  try {
    const result = await connection.execute(`SELECT E.*, EMPNO "empNo", ENAME "eName", JOB "job", DEPTNO "selectDept" FROM EMP E WHERE EMPNO = ${empNo}`); // 해당 사번을 가진사람의 정보 리턴
    const columnNames = result.metaData.map(column => column.name);
    // 쿼리 결과를 JSON 형태로 변환
    const rows = result.rows.map(row => {
      // 각 행의 데이터를 컬럼명에 맞게 매핑하여 JSON 객체로 변환
      const obj = {};
      columnNames.forEach((columnName, index) => {
        obj[columnName] = row[index];
      });
      return obj;
    });
    // 리턴 (맵 형태로)
    res.json({ // 코드가 성공적으로 실행됐을때 이 코드를 보내줌
        result : "success",
        info : rows[0]
    });
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).send('Error executing query');
  }
});

app.get('/emp/delete', async (req, res) => {
  const { empNo } = req.query; // 파라미터 값 받아줌

  try {
    await connection.execute(
      `DELETE FROM EMP WHERE EMPNO = :empNo`,
      [empNo], // 변수 사용하는법1. 넣고자 하는 변수 이 리스트에 담고, 그후 :으로 위에서 호출
      { autoCommit: true } // 변수 사용하는법2. '${}' 사용해서 넣기
    );
    res.json({// 코드가 성공적으로 실행됐을때 이 코드를 보내줌
        result : "success"
    });
  } catch (error) {
    console.error('Error executing insert', error);
    res.status(500).send('Error executing insert');
  }
});

app.get('/prof/list', async (req, res) => { 
  const { } = req.query;
  try {
    const result = await connection.execute(`SELECT * FROM PROFESSOR`);
    const columnNames = result.metaData.map(column => column.name);
    // 쿼리 결과를 JSON 형태로 변환
    const rows = result.rows.map(row => {
      // 각 행의 데이터를 컬럼명에 맞게 매핑하여 JSON 객체로 변환
      const obj = {};
      columnNames.forEach((columnName, index) => {
        obj[columnName] = row[index];
      });
      return obj;
    });
    // 리턴 (맵 형태로)
    res.json({ // 코드가 성공적으로 실행됐을때 이 코드를 보내줌
        result : "success",
        profList : rows // 해당 이름으로 value를 보내줌
    });
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).send('Error executing query');
  }
});

app.get('/prof/delete', async (req, res) => {
  const { profNo } = req.query; // 파라미터 값 보내줌

  try {
    await connection.execute(
      `DELETE FROM PROFESSOR WHERE PROFNO = :profNo`,
      [profNo], // 변수 사용하는법1. 넣고자 하는 변수 이 리스트에 담고, 그후 :으로 위에서 호출
      { autoCommit: true } // 변수 사용하는법2. '${}' 사용해서 넣기
    );
    res.json({// 코드가 성공적으로 실행됐을때 이 코드를 보내줌
        result : "success"
    });
  } catch (error) {
    console.error('Error executing insert', error);
    res.status(500).send('Error executing insert');
  }
});

app.get('/emp/insert', async (req, res) => {
  const { empNo, eName, job, selectDept } = req.query; // 파라미터 값 보내줌

  try {
    await connection.execute(
      `INSERT INTO EMP(EMPNO, ENAME, JOB, DEPTNO) VALUES(:empNo, :eName, :job, :selectDept)`,
      [empNo, eName, job, selectDept], // 변수 사용하는법1. 넣고자 하는 변수 이 리스트에 담고, 그후 :으로 위에서 호출
      { autoCommit: true } // 변수 사용하는법2. '${}' 사용해서 넣기
    );
    res.json({// 코드가 성공적으로 실행됐을때 이 코드를 보내줌
        result : "success"
    });
  } catch (error) {
    console.error('Error executing insert', error);
    res.status(500).send('Error executing insert');
  }
});

// 서버 시작
app.listen(3009, () => {
  console.log('Server is running on port 3009');
});

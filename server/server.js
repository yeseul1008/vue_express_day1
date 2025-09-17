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
  const { deptNo } = req.query;
  let query = "";
  if (deptNo != null && deptNo != "") {// ""도아니고 null도 아닐떄 실행해야하니까
    query += `WHERE E.DEPTNO = ${deptNo}` // deptNo에 값이 없으면 ""만 담기고
  }
  try {
    const result = await connection.execute(`SELECT * FROM EMP E LEFT JOIN DEPT D ON E.DEPTNO = D.DEPTNO ${query} ORDER BY SAL DESC`);
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
      result: "success",
      empList: rows // 해당 이름으로 value를 보내줌
    });
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).send('Error executing query');
  }
});

app.get('/emp/info', async (req, res) => {
  const { empNo } = req.query;
  try {
    const result = await connection.execute(
      `SELECT E.*, DNAME, EMPNO "empNo", ENAME "eName", JOB "job", E.DEPTNO "selectDept" `
      + `FROM EMP E `
      + `INNER JOIN DEPT D ON E.DEPTNO = D.DEPTNO `
      + `WHERE EMPNO = ${empNo}`
    );
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
    // 리턴
    res.json({
      result: "success",
      info: rows[0]
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
      result: "success"
    });
  } catch (error) {
    console.error('Error executing insert', error);
    res.status(500).send('Error executing insert');
  }
});

app.get('/emp/deleteAll', async (req, res) => {
  const { removeList } = req.query; // 파라미터 값 받아줌
  console.log(removeList);
  let query = "DELETE FROM EMP WHERE EMPNO IN(";
  for (let i = 0; i < removeList.length; i++) {
    query += removeList[i];
    if (removeList.length - 1 != i) {
      query += ","; //마지막 값이 아닐때만 반점 붙임
    }
  }
  query += ")";

  try {

    await connection.execute(
      query,
      [], // 변수 사용하는법1. 넣고자 하는 변수 이 리스트에 담고, 그후 :으로 위에서 호출
      { autoCommit: true } // 변수 사용하는법2. '${}' 사용해서 넣기
    );
    res.json({// 코드가 성공적으로 실행됐을때 이 코드를 보내줌
      result: "success"
    });
  } catch (error) {
    console.error('Error executing insert', error);
    res.status(500).send('Error executing insert');
  }
});

app.get('/prof/deleteAll', async (req, res) => {
  const { removeList } = req.query; // 파라미터 값 받아줌
  console.log(removeList);
  let query = "DELETE FROM PROFESSOR WHERE PROFNO IN(";
  for (let i = 0; i < removeList.length; i++) {
    query += removeList[i];
    if (removeList.length - 1 != i) {
      query += ","; //마지막 값이 아닐때만 반점 붙임
    }
  }
  query += ")";

  try {

    await connection.execute(
      query,
      [], // 변수 사용하는법1. 넣고자 하는 변수 이 리스트에 담고, 그후 :으로 위에서 호출
      { autoCommit: true } // 변수 사용하는법2. '${}' 사용해서 넣기
    );
    res.json({// 코드가 성공적으로 실행됐을때 이 코드를 보내줌
      result: "success"
    });
  } catch (error) {
    console.error('Error executing insert', error);
    res.status(500).send('Error executing insert');
  }
});

app.get('/prof/info', async (req, res) => {
  const { profNo } = req.query; // 사번 받아주고 
  try { // where절을 통해 해당 사번 불러오기
    const result = await connection.execute(`SELECT P.*, PROFNO "profNo", NAME "profName", ID "profId", POSITION "profPs", PAY "profPay" FROM PROFESSOR P WHERE PROFNO = ${profNo}`); // 해당 사번을 가진사람의 정보 리턴
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
      result: "success",
      info: rows[0]
    });
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).send('Error executing query');
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
      result: "success",
      profList: rows // 해당 이름으로 value를 보내줌
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
      result: "success"
    });
  } catch (error) {
    console.error('Error executing insert', error);
    res.status(500).send('Error executing insert');
  }
});

app.get('/prof/update', async (req, res) => {
  const { profName, profId, profPs, profPay, profNo } = req.query; // 파라미터 값 보내줌

  try {
    await connection.execute(
      `UPDATE PROFESSOR SET NAME = :profName, ID = :profId, POSITION = :profPs, PAY = :profPay WHERE PROFNO = :profNo`,
      [profName, profId, profPs, profPay, profNo], // 변수 사용하는법1. 넣고자 하는 변수 이 리스트에 담고, 그후 :으로 위에서 호출
      { autoCommit: true } // 변수 사용하는법2. '${}' 사용해서 넣기
    );
    res.json({// 코드가 성공적으로 실행됐을때 이 코드를 보내줌
      result: "success"
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
      result: "success"
    });
  } catch (error) {
    console.error('Error executing insert', error);
    res.status(500).send('Error executing insert');
  }
});

app.get('/emp/update', async (req, res) => {
  const { empNo, eName, job, selectDept } = req.query; // 파라미터 값 보내줌

  try {
    await connection.execute(
      `UPDATE EMP SET ENAME = :eName, JOB = :job, DEPTNO = :selectDept WHERE EMPNO = :empNo`,
      [eName, job, selectDept, empNo], // 변수 사용하는법1. 넣고자 하는 변수 이 리스트에 담고, 그후 :으로 위에서 호출
      { autoCommit: true } // 변수 사용하는법2. '${}' 사용해서 넣기
    );
    res.json({// 코드가 성공적으로 실행됐을때 이 코드를 보내줌
      result: "success"
    });
  } catch (error) {
    console.error('Error executing insert', error);
    res.status(500).send('Error executing insert');
  }
});
app.get('/board/list', async (req, res) => {
  const { pageSize, offset } = req.query;

  try {
    const result = await connection.execute(
      `SELECT B.*, TO_CHAR(CDATETIME, 'YYYY-MM-DD') AS CDATE FROM TBL_BOARD B `
      + `OFFSET ${offset} ROWS FETCH NEXT ${pageSize} ROWS ONLY`
    );
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
    const count = await connection.execute( // 게시글 전체 개수 세는 쿼리
      `SELECT COUNT(*) FROM TBL_BOARD B`
    );
    console.log(count); // rows의 리스트의 0번째에 담김
    console.log(count.rows[0][0]); // 개수만 꺼내오기

    // 리턴
    res.json({
      result: "success",
      boardList: rows,
      count: count.rows[0][0] // 게시글 개수
    });
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).send('Error executing query');
  }
});
app.get('/board/add', async (req, res) => {
  const { title, contents, userId, kind } = req.query; // 파라미터 값 보내줌

  try {
    await connection.execute(
      `INSERT INTO TBL_BOARD VALUES (B_SEQ.NEXTVAL, :title, :contents, :userId, 0, 0 , :kind, SYSDATE, SYSDATE)`,
      [title, contents, userId, kind], // 변수 사용하는법1. 넣고자 하는 변수 이 리스트에 담고, 그후 :으로 위에서 호출
      { autoCommit: true } // 변수 사용하는법2. '${}' 사용해서 넣기
    );
    res.json({// 코드가 성공적으로 실행됐을때 이 코드를 보내줌
      result: "success"
    });
  } catch (error) {
    console.error('Error executing insert', error);
    res.status(500).send('Error executing insert');
  }
});
app.get('/board/info', async (req, res) => {
  const { boardNo } = req.query; // 사번 받아주고 
  try { // where절을 통해 해당 사번 불러오기
    const result = await connection.execute(`SELECT B.*, TO_CHAR(CDATETIME, 'YYYY-MM-DD') CTIME FROM TBL_BOARD B WHERE BOARDNO =${boardNo}`); // 해당 사번을 가진사람의 정보 리턴
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
      result: "success",
      info: rows[0] //0번쨰꺼만 리턴하도록 미리 정의
    });
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).send('Error executing query');
  }
});


///////개인프로젝트///////
app.get('/web/login', async (req, res) => { //로그인
  const { userId, pwd } = req.query;
  let query = `SELECT * FROM USER_TBL WHERE USER_ID = '${userId}' AND PASSWORD = '${pwd}'`
  try {
    const result = await connection.execute(query);
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
    res.json(rows);
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).send('Error executing query');
  }
});
app.get('/web/list', async (req, res) => {
  const { genre, title } = req.query; // 클라이언트에서 genre와 title 값 받기

  try {
    let sql = `SELECT * FROM WEBTOON_TBL`;
    let binds = [];
    let conditions = [];

    // 장르 필터
    if (genre && genre !== "전체") {
      conditions.push(`GENRE = :genre`);
      binds.push(genre);
    }

    // 제목 검색 필터
    if (title && title.trim() !== "") {
      conditions.push(`TITLE LIKE :title`);
      binds.push(`%${title}%`);
    }

    // 조건이 하나라도 있으면 WHERE 추가
    if (conditions.length > 0) {
      sql += " WHERE " + conditions.join(" AND ");
    }

    const result = await connection.execute(sql, binds); // 바인딩
    const columnNames = result.metaData.map(column => column.name);

    const rows = result.rows.map(row => {
      const obj = {};
      columnNames.forEach((columnName, index) => {
        obj[columnName] = row[index];
      });
      return obj;
    });

    res.json({ webtoonlist: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});


app.get('/web/info', async (req, res) => { //웬툰 하나의 정보 가져오기
  const { webtoonId } = req.query;
  try {
    const result = await connection.execute(
      `SELECT * FROM WEBTOON_TBL WHERE WEBTOON_ID = :id`,
      [Number(webtoonId)]
    );
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
    // 리턴
    res.json({
      result: "success",
      info: rows[0]
    });
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).send('Error executing query');
  }
});
app.get('/web/reviewinfo', async (req, res) => {// 특정 웹툰의 리뷰만 출력
  const { webtoonId } = req.query;
  try {
    const result = await connection.execute(
      `SELECT R.REVIEW_ID, R.USER_ID, R.WEBTOON_ID, R.RATING, R.CONTENTS, R.CREATED_AT, U.NICKNAME
       FROM REVIEW_TBL R
       INNER JOIN USER_TBL U ON R.USER_ID = U.USER_ID
       WHERE R.WEBTOON_ID = :id`,
      [Number(webtoonId)]

    );
    console.log(result);
    const columnNames = result.metaData.map(c => c.name);

    const rows = result.rows.map(row => {
      const obj = {};
      columnNames.forEach((colName, idx) => {
        obj[colName] = row[idx];
      });
      return obj;
    });

    res.json({
      result: "success",
      reviewlist: rows
    });

  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).send('Error executing query');
  }
});
app.get('/web/addreview', async (req, res) => { //리뷰추가
  const { sessionUserId, selectedId, rating, contentReview } = req.query; // 파라미터 값 보내줌

  try {
    await connection.execute(
      `INSERT INTO REVIEW_TBL (REVIEW_ID, USER_ID, WEBTOON_ID, RATING, CONTENTS) VALUES (SEQ_REVIEW_ID.NEXTVAL, :sessionUserId, :selectedId, :rating, :contentReview)`,
      [sessionUserId, selectedId, rating, contentReview], // 변수 사용하는법1. 넣고자 하는 변수 이 리스트에 담고, 그후 :으로 위에서 호출
      { autoCommit: true } // 변수 사용하는법2. '${}' 사용해서 넣기
    );
    res.json({// 코드가 성공적으로 실행됐을때 이 코드를 보내줌
      result: "success"
    });
  } catch (error) {
    console.error('Error executing insert', error);
    res.status(500).send('Error executing insert');
  }
});
app.get('/web/addwebtoon', async (req, res) => { //리뷰추가
  const { title, author, genre, form, thumbnail, synopsis } = req.query; // 파라미터 값 보내줌

  try {
    await connection.execute(
      `INSERT INTO WEBTOON_TBL (WEBTOON_ID, TITLE, AUTHOR, GENRE, PLATFORM, THUMBNAIL_URL, SYNOPSIS) VALUES (SEQ_WEBTOON_ID.NEXTVAL, :title, :author, :genre, :form, :thumbnail, :synopsis)`,
      [title, author, genre, form, thumbnail, synopsis], // 변수 사용하는법1. 넣고자 하는 변수 이 리스트에 담고, 그후 :으로 위에서 호출
      { autoCommit: true } // 변수 사용하는법2. '${}' 사용해서 넣기
    );
    res.json({// 코드가 성공적으로 실행됐을때 이 코드를 보내줌
      result: "success"
    });
  } catch (error) {
    console.error('Error executing insert', error);
    res.status(500).send('Error executing insert');
  }
});
app.get('/web/myreview', async (req, res) => { //한 유저가 작성한리뷰 리스트 보냄
  const { sessionUserId } = req.query;
  try {
    const result = await connection.execute(
      `SELECT * FROM REVIEW_TBL R INNER JOIN WEBTOON_TBL W ON R.WEBTOON_ID = W.WEBTOON_ID WHERE USER_ID = :sessionUserId`,
      [sessionUserId]
    );
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
    // 리턴
    res.json({
      result: "success",
      myreview: rows
    });
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).send('Error executing query');
  }
});
app.get('/web/editreviewInfo', async (req, res) => { //리뷰 하나의 정보 가져오기
  const { reviewid } = req.query;
  try {
    const result = await connection.execute(
      `SELECT * FROM REVIEW_TBL WHERE REVIEW_ID = :reviewid`,
      [reviewid]
    );
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
    // 리턴
    res.json({
      result: "success",
      info: rows[0]
    });
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).send('Error executing query');
  }
});

app.get('/web/update', async (req, res) => {
  const { contents, rating, reviewid } = req.query; // 파라미터 값 보내줌
  try {
    await connection.execute(
      `UPDATE REVIEW_TBL SET CONTENTS = :contents, RATING = :rating WHERE REVIEW_ID = :reviewid`,
      [contents, rating, reviewid], // 변수 사용하는법1. 넣고자 하는 변수 이 리스트에 담고, 그후 :으로 위에서 호출
      { autoCommit: true } // 변수 사용하는법2. '${}' 사용해서 넣기
    );
    res.json({// 코드가 성공적으로 실행됐을때 이 코드를 보내줌
      result: "success"
    });
  } catch (error) {
    console.error('Error executing insert', error);
    res.status(500).send('Error executing insert');
  }
});
app.get('/web/userlist', async (req, res) => {
  const { } = req.query;
  try {
    const result = await connection.execute(`SELECT * FROM USER_TBL`);
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
    // console.log(result);
    // 리턴 (맵 형태로)
    res.json({ // 코드가 성공적으로 실행됐을때 이 코드를 보내줌
      result: "success",
      userList: rows // 해당 이름으로 value를 보내줌
    });
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).send('Error executing query');
  }
});
app.get('/web/useradd', async (req, res) => {
  const { userId, pwd, nickname, mail, gender } = req.query; // 파라미터 값 보내줌
  try {
    await connection.execute(
      `INSERT INTO USER_TBL VALUES(:userId, :pwd, :nickname, :mail, :gender, 'A')`,
      [userId, pwd, nickname, mail, gender], // 변수 사용하는법1. 넣고자 하는 변수 이 리스트에 담고, 그후 :으로 위에서 호출
      { autoCommit: true } // 변수 사용하는법2. '${}' 사용해서 넣기
    );
    res.json({// 코드가 성공적으로 실행됐을때 이 코드를 보내줌
      result: "success"
    });
  } catch (error) {
    console.error('Error executing insert', error);
    res.status(500).send('Error executing insert');
  }
});
app.get('/web/userdelete', async (req, res) => {
  const { userId } = req.query; // 파라미터 값 보내줌

  try {
    await connection.execute(
      `DELETE FROM USER_TBL WHERE USER_ID = :userId`,
      [userId], // 변수 사용하는법1. 넣고자 하는 변수 이 리스트에 담고, 그후 :으로 위에서 호출
      { autoCommit: true } // 변수 사용하는법2. '${}' 사용해서 넣기
    );
    res.json({// 코드가 성공적으로 실행됐을때 이 코드를 보내줌
      result: "success"
    });
  } catch (error) {
    console.error('Error executing insert', error);
    res.status(500).send('Error executing insert');
  }
});
app.get('/web/useredit', async (req, res) => { //유저정보 수정
  const { afterId, afterpwd, afternickname, aftergender, originalId} = req.query; // 파라미터 값 보내줌

  try {
    await connection.execute(
      `UPDATE USER_TBL SET USER_ID = :afterId, PASSWORD = :afterpwd, NICKNAME = :afternickname, GENDER = :aftergender WHERE USER_ID = :originalId`,
      [afterId, afterpwd, afternickname, aftergender, originalId], // 변수 사용하는법1. 넣고자 하는 변수 이 리스트에 담고, 그후 :으로 위에서 호출
      { autoCommit: true } // 변수 사용하는법2. '${}' 사용해서 넣기
    );
    res.json({// 코드가 성공적으로 실행됐을때 이 코드를 보내줌
      result: "success"
    });
  } catch (error) {
    console.error('Error executing insert', error);
    res.status(500).send('Error executing insert');
  }
});
app.get('/web/webedit', async (req, res) => { //유저정보 수정
  const { TITLE, AUTHOR, GENRE, PLATFORM, THUMBNAIL, originalId} = req.query; // 파라미터 값 보내줌

  try {
    await connection.execute(
      `UPDATE WEBTOON_TBL SET TITLE = :TITLE, AUTHOR = :AUTHOR, GENRE = :GENRE, PLATFORM = :PLATFORM, THUMBNAIL = :THUMBNAIL WHERE WEBTOON_ID = :originalId`,
      [ TITLE, AUTHOR, GENRE, PLATFORM, THUMBNAIL, originalId], // 변수 사용하는법1. 넣고자 하는 변수 이 리스트에 담고, 그후 :으로 위에서 호출
      { autoCommit: true } // 변수 사용하는법2. '${}' 사용해서 넣기
    );
    res.json({// 코드가 성공적으로 실행됐을때 이 코드를 보내줌
      result: "success"
    });
  } catch (error) {
    console.error('Error executing insert', error);
    res.status(500).send('Error executing insert');
  }
});
app.get('/web/userinfo', async (req, res) => { //유저 하나의 정보 가져오기
  const { sessionUserId } = req.query;
  try {
    const result = await connection.execute(
      `SELECT * FROM USER_TBL WHERE USER_ID = :sessionUserId`,
      [sessionUserId]
    );
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
    // 리턴
    res.json({
      result: "success",
      info: rows[0]
    });
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).send('Error executing query');
  }
});
// 서버 시작
app.listen(3009, () => {
  console.log('Server is running on port 3009');
});

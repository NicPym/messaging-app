const flatten = require("flat");
const unflatten = require("flat").unflatten;

exports.dataCleaner = (data) => {
  let found = false;
  const findKey = (obj) => {
    if (found) return;
    if (Object.keys(obj).includes("dataValues")) {
      found = true;
      return;
    }
    if (Object.keys(obj).length === 0) {
      return;
    }

    Object.keys(obj).forEach((child) => {
      findKey(obj[child]);
    });
  };
  findKey(data);

  if (found) {
    let rows;
    let meta = [];
    if (Array.isArray(data)) {
      rows = data.map((e) => {
        e = clean(JSON.parse(JSON.stringify(e)));
        const obj = {};
        const keys = Object.keys(e);
        const values = Object.values(e);
        keys.forEach((ele, index) => {
          obj[ele.trim()] = values[index];
        });
        return obj;
      }, []);
      let counter = 0;
      rows.map((e) => {
        Object.keys(e).forEach((ele) => {
          if (meta.findIndex((elem) => ele === elem.name) === -1) {
            meta = meta.concat({ name: ele.trim(), id: counter });
            ++counter;
          }
        });
      });
    } else {
      rows = {};
      data = clean(JSON.parse(JSON.stringify(data)));
      const keys = Object.keys(data);
      const values = Object.values(data);
      keys.forEach((ele, index) => {
        rows[ele.trim()] = values[index];
      });
      meta = Object.keys(rows).map((e, i) => {
        return { name: e.trim(), id: i };
      });
    }
    return { rows: Array.isArray(rows) ? rows : [rows], meta: meta };
  }
  return data;
};

const clean = (obj) => {
  obj = flatten(obj);
  const values = Object.values(obj);
  const removeKeys = [];
  Object.keys(obj).forEach((e, i) => {
    let temp = e.split(".");
    if (values[i] === null) {
      removeKeys.push(temp[0]);
    } else if (e.includes(".") && !e.includes("_")) {
      if (/\d\./.test(e)) {
        let index =
          temp.findIndex((ele, i) => {
            if (!isNaN(ele)) return i;
          }) - 1;
        if (!removeKeys.join(", ").includes(temp[0])) removeKeys.push(temp[0]);
        temp = temp.splice(index);
        temp[0] = temp[0].match(/[A-Z][a-z]+|[0-9]+/g).join(" ");
        temp = temp.join(".");
        obj[temp] = values[i];
      } else {
        obj[temp[temp.length - 1]] = obj[e];
        delete obj[e];
      }
    }
  });
  obj = unflatten(obj);
  removeKeys.forEach((e) => {
    delete obj[e];
  });

  return obj;
};

exports.formatDate = (date, type) => {
  let retVal = "";
  if (date !== undefined && date !== null && date !== "") {
    date = new Date(date);
    switch (type) {
      case "date":
        retVal += `${date.getFullYear()}-`;
        retVal +=
          date.getMonth() + 1 < 10
            ? `0${date.getMonth() + 1}-`
            : `${date.getMonth() + 1}-`;
        retVal +=
          date.getDate() < 10 ? `0${date.getDate()}` : `${date.getDate()}`;

        break;

      case "dateTime":
        retVal += `${date.getFullYear()}-`;
        retVal +=
          date.getMonth() + 1 < 10
            ? `0${date.getMonth() + 1}-`
            : `${date.getMonth() + 1}-`;
        retVal +=
          date.getDate() < 10 ? `0${date.getDate()}, ` : `${date.getDate()} `;
        retVal +=
          date.getHours() < 10 ? `0${date.getHours()}:` : `${date.getHours()}:`;
        retVal +=
          date.getMinutes() < 10
            ? `0${date.getMinutes()}`
            : `${date.getMinutes()}`;
        break;

      case "time":
        retVal +=
          date.getHours() < 10 ? `0${date.getHours()}:` : `${date.getHours()}:`;
        retVal +=
          date.getMinutes() < 10
            ? `0${date.getMinutes()}`
            : `${date.getMinutes()}`;
        break;

      default:
        break;
    }
  }
  return retVal;
};

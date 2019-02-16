const path = require("path");
const fs = require("fs");
const node_xj = require("xls-to-json");

node_xj(
  {
    input: path.join(
      process.cwd(),
      "static",
      "Direktori Fintech per Juni 2018.xlsx"
    ), // input xls
    output: path.join(process.cwd(), "static", "ok2.json") // output json
  },
  function(err, result) {
    if (err) {
      console.error(err);
    } else {
      res = result.map(r => ({
        raw: { ...r },
        alamat: r["Alamat"],
        badan_hukum: r["Badan Hukum"],
        is_syariah: r["Jenis Usaha"] === "Syariah"
      }));
      console.log(res);
      fs.writeFileSync(
        path.join(process.cwd(), "static", "ojk2.json"),
        JSON.stringify(res, null, 2)
      );
    }
  }
);

const path = require("path");
const node_xj = require("xls-to-json");

node_xj(
  {
    input: path.join(
      process.cwd(),
      "static",
      "Direktori Fintech per Juni 2018.xlsx"
    ), // input xls
    output: path.join(process.cwd(), "static", "ojk.json") // output json
  },
  function(err, result) {
    if (err) {
      console.error(err);
    } else {
      console.log(result);
    }
  }
);

const express = require("express");
const whois = require("whois-json-filter");
const getWebsiteData = require("./getWebsiteData");
const app = express();

app.get("/", async (req, res) => {
  const data = await getWebsiteData(req.query?.url);
  data?.status
    ? res.send(data).status(200)
    : res.send(data).status(402);
});

app.get("/domain", (req, res) => {
  try {
    const domainName = new URL(req.query?.url).hostname?.replace("www.", "");
    whois(domainName, function (err, response) {
      if (err) {
        console.error("Error:", err);
        res.send({status:false,message:'Invalid URL'}).status(404)
      } else {
        res.send({status:true,response});
      }
    });
  } catch (error) {
    console.error(error);
    res.send({status:false,message:'Invalid URL'}).status(404)
  }
});

app.listen(process.env.PORT, () =>
  console.log(`Example app listening on port ${process.env.PORT}!`)
);



	
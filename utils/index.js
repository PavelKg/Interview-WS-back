const content_type = (type) => {
  return { "Content-Type": `${type}; charset=utf8` }
}

const c_type = {
  json: "application/json",
  html: "text/html",
  icon: "image/x-icon"
};

const response = (answer)=>{
  try{
    const {res, code, body} = answer;
    res.writeHead(code, content_type(c_type["json"]));
    res.write(body);
    res.end();
  } catch(error) {
    console.log("utils-response-error: %s", error)
  }  
}

module.exports.response = response; 
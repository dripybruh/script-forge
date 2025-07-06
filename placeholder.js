document.getElementById("runBtn").onclick = () => {
  const code = document.getElementById("codeInput").value;
  // parse & execute your custom script language
  console.log("Running code:", code);
};

document.getElementById("resetBtn").onclick = () => {
  // reset stage or sprite positions
  console.log("Stage reset");
};

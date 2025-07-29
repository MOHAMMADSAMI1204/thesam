const form = document.getElementById("teamForm");
const successMsg = document.getElementById("successMsg");

const webhookURL = "";

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const teamName = document.getElementById("teamName").value.trim();
  const igl = document.getElementById("igl").value.trim();
  const rusher = document.getElementById("rusher").value.trim();
  const assaulter = document.getElementById("assaulter").value.trim();
  const sniper = document.getElementById("sniper").value.trim();
  const substitute = document.getElementById("substitute").value.trim();
  const title = document.getElementById("titleEditable").innerText.trim();

  const content = `**${title}**\n\n`
    + `**Team Name:** ${teamName}\n`
    + `**IGL:** <@${igl}>\n`
    + `**Rusher:** <@${rusher}>\n`
    + `**Assaulter:** <@${assaulter}>\n`
    + `**Sniper:** <@${sniper}>\n`
    + `**Substitute:** ${substitute ? `<@${substitute}>` : "None"}`;

  try {
    await fetch(webhookURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content })
    });

    successMsg.style.display = "block";
    form.style.display = "none";
  } catch (error) {
    alert("Something went wrong. Please try again.");
    console.error(error);
  }
});

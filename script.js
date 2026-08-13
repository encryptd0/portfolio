// const emailAddress = "riekusgroblerps4@gmail.com"

// const email = document.querySelector(".email");
// const emailText = document.querySelector(".email-text");


// email.addEventListener("click", async (event) => {
//     event.preventDefault();

//     try {
//         await navigator.clipboard.writeText(emailAddress);

//         const originalText = email.textContent;

//         email.textContent = "Copied!";

//         setTimeout(() => {
//             email.textContent = originalText;
//         }, 1500);
//     } catch (error) {
//         console.error("Failed to copy email:", error);
//     }
// });




const emailAddress = "riekusgroblerps4@gmail.com"

const email = document.querySelector(".email");
const emailText = document.querySelector(".email-text");

email.addEventListener("click", async (event) => {
    event.preventDefault();

    try {
        await navigator.clipboard.writeText(emailAddress);

        emailText.textContent = "Copied!";

        setTimeout(() => {
            emailText.textContent = "riekusgroblerps4 [at] gmail [dot] com";
        }, 1500);
    } catch (error) {
        console.error("Failed to copy email:", error);
    }
});
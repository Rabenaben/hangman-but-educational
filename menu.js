document.addEventListener("DOMContentLoaded", function() {
    const startBtn = document.getElementById("startBtn");

    startBtn.addEventListener("click", function() {
        startBtn.remove(); // Remove the start button
        const options = document.getElementById("options");
        options.classList.remove("hidden");
    });

    const playBtn = document.getElementById("playBtn");

    playBtn.addEventListener("click", function() {
        const topic = document.getElementById("topic").value;
        window.location.href = `index.html?topic=${topic}`;
    });

    const termsBtn = document.getElementById("termsBtn");

    termsBtn.addEventListener("click", function() {
        window.location.href = "termdef.html";
    });
});
document.addEventListener("DOMContentLoaded", function() {
    const englishList = document.getElementById("englishList");
    const mathList = document.getElementById("mathList");
    const scienceList = document.getElementById("scienceList");
    const searchInput = document.getElementById("searchInput");
    const suggestions = document.getElementById("suggestions");
    const termListsContainer = document.getElementById("termListsContainer");
    const englishTermsDiv = document.getElementById("englishTerms");
    const mathTermsDiv = document.getElementById("mathTerms");
    const scienceTermsDiv = document.getElementById("scienceTerms");

    // Function to capitalize the first letter of a string
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    // Function to filter terms based on search input
    function filterTerms(searchTerm) {
        const filteredEnglishTerms = engWordList.filter(term =>
            term.word.toLowerCase().includes(searchTerm.toLowerCase())
        );
        const filteredMathTerms = mathWordList.filter(term =>
            term.word.toLowerCase().includes(searchTerm.toLowerCase())
        );
        const filteredScienceTerms = scienceWordList.filter(term =>
            term.word.toLowerCase().includes(searchTerm.toLowerCase())
        );

        // Clear previous results
        englishList.innerHTML = "";
        mathList.innerHTML = "";
        scienceList.innerHTML = "";

        // Display filtered terms with first letter capitalized
        filteredEnglishTerms.forEach(term => {
            const li = document.createElement("li");
            li.textContent = `${capitalizeFirstLetter(term.word)}: ${term.hint}`;
            englishList.appendChild(li);
        });

        filteredMathTerms.forEach(term => {
            const li = document.createElement("li");
            li.textContent = `${capitalizeFirstLetter(term.word)}: ${term.hint}`;
            mathList.appendChild(li);
        });

        filteredScienceTerms.forEach(term => {
            const li = document.createElement("li");
            li.textContent = `${capitalizeFirstLetter(term.word)}: ${term.hint}`;
            scienceList.appendChild(li);
        });

        // Rearrange term lists based on the search term
        moveTermCategoryToTop(searchTerm);
    }

    // Function to display suggestions based on search input
    function displaySuggestions(searchTerm) {
        // Clear previous suggestions
        suggestions.innerHTML = "";

        if (searchTerm === "") {
            return;
        }

        const allTerms = [...engWordList, ...mathWordList, ...scienceWordList];
        const filteredSuggestions = allTerms.filter(term =>
            term.word.toLowerCase().includes(searchTerm.toLowerCase())
        );

        filteredSuggestions.forEach(term => {
            const li = document.createElement("li");
            li.textContent = capitalizeFirstLetter(term.word);
            li.addEventListener("click", function() {
                searchInput.value = term.word;
                filterTerms(term.word);
                suggestions.innerHTML = "";
            });
            suggestions.appendChild(li);
        });
    }

    // Function to move the term category to the top
    function moveTermCategoryToTop(term) {
        const englishTerm = engWordList.find(t => t.word.toLowerCase() === term.toLowerCase());
        const mathTerm = mathWordList.find(t => t.word.toLowerCase() === term.toLowerCase());
        const scienceTerm = scienceWordList.find(t => t.word.toLowerCase() === term.toLowerCase());

        // Clear previous order
        termListsContainer.innerHTML = "";

        if (englishTerm) {
            termListsContainer.appendChild(englishTermsDiv);
        } else if (mathTerm) {
            termListsContainer.appendChild(mathTermsDiv);
        } else if (scienceTerm) {
            termListsContainer.appendChild(scienceTermsDiv);
        }

        // Append remaining lists
        if (!englishTerm) termListsContainer.appendChild(englishTermsDiv);
        if (!mathTerm) termListsContainer.appendChild(mathTermsDiv);
        if (!scienceTerm) termListsContainer.appendChild(scienceTermsDiv);
    }

    // Event listener for search input
    searchInput.addEventListener("input", function() {
        const searchTerm = this.value;
        filterTerms(searchTerm);
        displaySuggestions(searchTerm);
    });

    // Initial display of all terms
    filterTerms("");
});
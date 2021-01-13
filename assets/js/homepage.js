var userForm = document.querySelector("#user-form");
var nameInput = document.querySelector("#username");
var repoContainer = document.querySelector("#repos-container");
var repoSearchTerm = document.querySelector("#repo-search-term");
var languageButton = document.querySelector("#language-buttons")

var getUserRepos = function(user) {
    // format the github api url
    var apiUrl = "https://api.github.com/users/" + user + "/repos";
  
    // make a request to the url
    fetch(apiUrl).then(function(response) {
        //request was succesful
        if(response.ok){
            response.json().then(function(data) {
                displayRepos(data, user);
            });
        }
        else{
            alert("Error: " + response.statusText);
        }
    })
    .catch(function(error){
        alert("Unable to connect to GitHub");
    });
};
 
var formSubmitHandler = function(event){
    event.preventDefault();
    var username = nameInput.value.trim();

    if (username){
        getUserRepos(username);
        nameInput.value = "";
    }
    else{
        alert("Please enter a Github username");
    }
};

var displayRepos = function(repos, searchTerm){
    // clear old content
    repoContainer.textContent = "";
    repoSearchTerm.textContent = searchTerm;
    
   // loop over repos
    for (var i = 0; i < repos.length; i++) {
        // check if api returned any repos
        if (repos.length === 0) {
            repoContainerEl.textContent = "No repositories found.";
            return;
        }

        // format repo name
        var repoName = repos[i].owner.login + "/" + repos[i].name;
    
        // create a link for each repo
        var repo = document.createElement("a");
        repo.classList = "list-item flex-row justify-space-between align-center";
        repo.setAttribute("href", "./single-repo.html?repo=" + repoName);
    
        // create a span element to hold repository name
        var titleEl = document.createElement("span");
        titleEl.textContent = repoName;

        // create a status element
        var statusEl = document.createElement("span");
        statusEl.classList = "flex-row align-center";

        // check if current repo has issues or not
        if (repos[i].open_issues_count > 0) {
        statusEl.innerHTML =
            "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issue(s)";
        } else {
        statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
        }
        // append to container
        repo.appendChild(statusEl);

        // append to container
        repo.appendChild(titleEl);
    
        // append container to the dom
        repoContainer.appendChild(repo);
    }
}

var getFeaturedRepos = function(language){
    var apiUrl ="https://api.github.com/search/repositories?q=" + language + "+is:featured&sort=help-wanted-issues";

    fetch(apiUrl).then(function(response){
        if(response.ok){
            response.json().then(function(data){
                displayRepos(data.items, language);
            });
        }
        else{
            alert("Error: " + response.statusText)
        };
    });
};

var buttonClickHandler = function(event){
    var language = event.target.getAttribute("data-language");
    if (language){
        getFeaturedRepos(language);

        //clear old content
        repoContainer.textContent = "";
    }
};

languageButton.addEventListener("click", buttonClickHandler);
userForm.addEventListener("submit", formSubmitHandler);
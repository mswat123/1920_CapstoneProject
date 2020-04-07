// API endpoint url
var url = 'http://newsapi.org/v2/top-headlines?' +
          'q=' + "corona" + 
          '&country=us&' +
          'apiKey=a989bbb7e5ea4c30a8cda5d0272a49b3';
var req = new Request(url);

// Do api call
fetch(req)
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        console.log(data);
        try{
            // Collect the newest 10 articles from return
            data.articles.slice(0,10).forEach(article => {

                // parse return and display desired information in HTML 
                document.getElementsByClassName("col")[0].innerHTML += `
                <div class='card mm4 valign-wrapper'>
                    <div class='card-header card-image waves-effect waves-block waves-light'>
                        <img class='activator' src=${article.urlToImage} alt=''/>
                    </div>
                    <div class='card-content'>
                        <h5 class='text-center card-title'>${article.title}</h5>
                    </div>
                    <div class="card-action">
                        <a href='${article.url}'>View Article</a>
                    </div>
                    <div class="card-reveal">
                        <h1 class="card-title grey-text text-darken-4"><i class="material-icons right">close</i></h1>
                        <h4 class='valign'>${article.description}</h4>
                    </div>
                </div>
                `;
                console.log(article.urlToImage); 
            });
        }
        catch(err){
            console.log(err)
        }
    });


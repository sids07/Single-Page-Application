alert("Main page")

const appRoute=[
  ['/',homeRoute],
  ['/signin',signinRoute],
  ['/signup',signupRoute],
  ['/write',writeRoute],
  ['/post',dataRoute],
  ['/post/:id',dataDetailRoute],
  ['/logout',logoutRoute],
]
appRoot=document.getElementById('appRoot')
navRoot =document.getElementById('navRoot')

function logoutRoute(match){
    localStorage.removeItem('Authentication')
    localStorage.removeItem('UserId')
    window.location.href='#/'
}
function navSel(){
    if (isAuthenticated()){
        let template= document.querySelector('#signed')
        const temElement = template.content.cloneNode(true);
        navRoot.innerHTML=''
        navRoot.appendChild(temElement)
        console.log("Signed in")
    }
    else {
        let template= document.querySelector('#unsigned')
        const temElement = template.content.cloneNode(true);
        navRoot.innerHTML=''
        navRoot.appendChild(temElement)
        console.log("Not signed in")
    }
}

function dataRoute(match){
    templateRenderer('http://127.0.0.1:8000/api/write','http://127.0.0.1:8000/static/temp/data.html')
}

function templateRenderer(url_1,url_2){
    Promise.all(
        [fetch(url_1,{
            method:'GET',
        }),
        fetch(url_2),
        ]
    ).then(res=> {
        return Promise.all([res[0].json(),res[1].text()])
    }).then(data=>{
        appRoot.innerHTML = data[1]
        console.log("Check")
        console.log(data[0])
        console.log(appRoot)

        let doc_template= document.querySelector('#write-card')

        data[0].forEach(function (element){
        const temElement = doc_template.content.cloneNode(true);
        console.log(temElement)
        console.log(element['title'])
        temElement.querySelector('img').setAttribute('src',element['image'])
        temElement.querySelector('h5').innerHTML=element['title']
        temElement.querySelector('p').innerHTML=element['summary']
        temElement.querySelector('a').setAttribute('href','#/post/'+element['id'])
        appRoot.appendChild(temElement);

})})}

function templateRenderer_det(url_1,url_2){
    Promise.all(
        [fetch(url_1,{
            method:'GET',
        }),
        fetch(url_2),
        ]
    ).then(res=> {
        return Promise.all([res[0].json(),res[1].text()])
    }).then(data=>{
        appRoot.innerHTML = data[1]

        console.log(appRoot)

        let doc_template= document.querySelector('#write-card')

        let don_1 = data[0]
        const temElement = doc_template.content.cloneNode(true);
        console.log(temElement)
        temElement.querySelector('img').setAttribute('src',don_1['image'])
        temElement.querySelector('h5').innerHTML=don_1['title']
        temElement.querySelector('p').innerHTML=don_1['summary']
        appRoot.appendChild(temElement);

})}


async function auth(url, username, password) {
    const result = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            'username': username,
            'password': password
        })
    });
    console.log(username)
    if (!result.ok) {
        return false;
    }

    const data = await result.json()

    localStorage.setItem('Authentication', data['token']);

    localStorage.setItem('UserId', data['user_id']);

    return true;
}

async function write_post(url,image,title,summary){
    let formData = new FormData();
    formData.append('title',title)
    formData.append('summary',summary)
    formData.append('image',image);

    const result = await fetch(url,{
        method :'POST',
        body:formData
})
    if (!result.ok) {
        return false;
    }

    const data = await result.json()
    console.log(data)
    return true;
}

async function create(url, username, email, password, confirm_password) {
    const result = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "username": username,
            "email": email,
            "password": password,
            "confirm_password":confirm_password
        })
    });

    if (!result.ok) {
        return false;
    }

    const data = await result.json()
    return true;
}

function isAuthenticated() {
    return !!localStorage.getItem('Authentication');
}

function homeFetch(url){
   fetch(url).then(function (template){
        return template.text()
    }).then(function (text){
        let parser = new DOMParser()

       const doc = parser.parseFromString(text, "text/html");
       let doc_html= doc.querySelector('html')
        appRoot.innerHTML=''
        appRoot.appendChild(doc_html)
    }).catch(function (err) {
	// There was an error
	console.warn('Something went wrong.', err);
    })
    }

async function htmlFetch(url){
    const re= await fetch(url,{method:'GET'})
    const data= await re.text()

    let parser = new DOMParser()

    const doc = parser.parseFromString(data, "text/html");
    let doc_html= doc.querySelector('form')
    appRoot.innerHTML=''
    appRoot.appendChild(doc_html)
    return doc_html
}

function homeRoute(match) {
   navSel()
   homeFetch('http://127.0.0.1:8000/static/temp/home.html')
}

async function writeRoute(match){
    navSel()
    const doc = await htmlFetch('http://127.0.0.1:8000/static/temp/post.html')
    console.log(doc)
    doc.addEventListener('submit', async (e) => {
            e.preventDefault();
            const form = e.target
            const isAuthorized = await write_post('http://127.0.0.1:8000/api/write/',form['myimg'].files[0], form['title'].value, form['summary'].value);

            if (isAuthorized) {
                window.location.href = '#/';
                console.log("Written in")
            } else {
                form.reset();
                console.log("Invalid Input")
            }
        });
}

async function signinRoute(match){
    navSel()
    // htmlFetch('http://127.0.0.1:8000/static/temp/signin.html')
    // // console.log("AAA")
    // //
    // // console.log(document.forms[0])
    // // console.log(document.forms['log'])
    // // const loginForm = document.querySelector('div').lastElementChild.innerHTML;
    // // console.log("A")
    // // console.log(loginForm)
    // //
    // // console.log("CC")
    // navChange()
    const doc = await htmlFetch('http://127.0.0.1:8000/static/temp/signin.html')
    doc.addEventListener('submit', async (e) => {
            e.preventDefault();
            const form = e.target
            const isAuthorized = await auth(form['action'], form['uid'].value, form['passed'].value);

            if (isAuthorized) {
                window.location.href = '#/';
                console.log("Logged in")
            } else {
                form.reset();
                console.log("credential not matched")
            }
        });

}

async function signupRoute(match){
    navSel()
    // navChange()
    const doc= await htmlFetch('http://127.0.0.1:8000/static/temp/signup.html')
    const doc_form = doc.forms
    doc.addEventListener('submit', async (e) => {
            e.preventDefault();
            const form = e.target

            const isAuthorized = await create(form['action'], form['username'].value, form['email'].value,form['password'].value,form['confirm_password'].value);

            if (isAuthorized) {
                window.location.href = '#/signin';
                console.log("Signuped in")
            } else {
                form.reset();
                console.log("Something went wrong")
            }
        });
}
const pathToRegex = path => new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$");

const getParams = match => {
    const values = match.result.slice(1);
    console.log(match.result)
    console.log(match.result.slice(1))
    const keys = Array.from(match.route[0].matchAll(/:(\w+)/g)).map(result => result[1]);
    console.log("Key check")
    console.log(Array.from(match.route[0].matchAll(/:(\w+)/g)))
    console.log(keys)
    return Object.fromEntries(keys.map((key, i) => {
        return [key, values[i]];
    }));
};

async function dataDetailRoute(match) {
    navSel()
    templateRenderer_det(`http://127.0.0.1:8000/api/write/${match.id}`,'http://127.0.0.1:8000/static/temp/details.html')
}

window.addEventListener('hashchange',chooseRoutes)
window.addEventListener('load',chooseRoutes)
function chooseRoutes()
{

    // const potentialMatches = appRoute.map(route=>{
    //     return{
    //         route:route,
    //         result: location.pathname == route[0]
    //     }
    // });
    //
    // console.log(potentialMatches)
    //
    // let found=potentialMatches.find(rd=>rd.result);
    //
    // if (!found){
    //     found={
    //         route: appRoute[0],
    //         result: true
    //     }
    // }
    // found.route[1]()

    const hash=window.location.hash.substring(1);
    if (!hash) {
        window.location.href = window.location.href + '#/';
    }

    const potentialMatches = appRoute.map(route=>{
        return{
            route:route,
            result: window.location.hash.substring(1).match(pathToRegex(route[0]))
        //  match will always give either result or null(if no result)
        }
        }
    )

    let found=potentialMatches.find(rd=>rd.result!==null);

    if(!found){
        found ={
          route: appRoute[0],
          result: [location.hash.substring(1)]
        }
    }

    const [,routeControllerfn]=found.route;
    const par = getParams(found)
    console.log(par)
    routeControllerfn(par);
}
//
// const navigateTo = url =>{
//     history.pushState(null,null,url);
//     console.log("AAA")
//     chooseRoutes();
// }
//
// window.addEventListener("popstate", chooseRoutes);
//
// document.addEventListener("DOMContentLoaded", () => {
//     document.body.addEventListener("click", e => {
//
//             console.log("AAAAA")
//             e.preventDefault();
//             const tar= e.target
//             const site = tar.href.split("/")
//             console.log(site)
//             console.log(site[site.length-1])
//             navigateTo(site[site.length-1]);
//
//     });
//     //
//     // chooseRoutes();
// });
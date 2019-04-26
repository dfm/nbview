(function () {

  function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
  };

  function convert_url (url) {
    var groups = /github\.com\/(.+)\/(raw|blob)\/(.*)/.exec(url);
    if ((groups || []).length < 4) return url;
    var new_url = "https://raw.githubusercontent.com/" + groups[1] + "/" + groups[3];
    console.log(new_url);
    return new_url;
  }

  function display_ipynb (url) {

    var inner_url = convert_url(url);
    document.getElementById("urlname").innerHTML = "<a href=\"" + inner_url + "\">" + inner_url + "</a>";
    document.getElementById("urlstuff").style.display = "block";
    document.getElementById("urlbar").value = inner_url;

    fetch(inner_url, {
      mode: "cors",
      redirect: "follow",
    })
    .then(function(response) {
      if (response.ok)
        return response.json();
      throw new Error(response.status);
    })
    .then(function(data) {
      var notebook = nb.parse(data);
      var rendered = notebook.render();
      rendered.querySelectorAll('pre code').forEach(function(block) {
        hljs.highlightBlock(block);
      });
      var el = document.getElementById("notebook");
      el.appendChild(rendered);
      el.style.display = "block";
    })
    .catch(function(error) {
      var el = document.getElementById("error");
      el.innerHTML = error;
      el.style.display = "block";
    });
  }

  var url = getUrlParameter("url");
  if (url.length) {
    display_ipynb(url);
  }

})();

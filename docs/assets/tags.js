document.querySelectorAll('.md-tag').forEach(function(tag) {
  var text = tag.textContent.trim().toLowerCase().replace(" ", "-");
  tag.id = text;
});
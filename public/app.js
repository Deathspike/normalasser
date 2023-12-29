const url = '/api/v1';

(function onLoad() {
  document.getElementById('input').addEventListener('keydown', function (ev) {
    if (ev.key !== 'Enter') return;
    sendAsync(this.value)
      .then(() => (this.value = ''))
      .catch(x => console.error(x));
  });
})();

(async function onTick() {
  await refreshAsync().catch(x => console.error(x));
  setTimeout(onTick, 5000);
})();

async function refreshAsync() {
  const response = await fetch(url);
  const {events, name, queue, version} = await response.json();
  document.getElementById('header').textContent = name;
  document.getElementById('events').textContent = events.join('\n') || '-';
  document.getElementById('queue').textContent = queue.join('\n') || '-';
  document.getElementById('version').textContent = version;
  document.getElementById('container').style.display = 'block';
  document.title = `${name} (${version})`;
}

async function sendAsync(path) {
  if (!path) return;
  const headers = {'Content-Type': 'application/json'};
  const method = 'POST';
  const body = JSON.stringify({series: {path}});
  await fetch(url, {body, headers, method});
  await refreshAsync();
}

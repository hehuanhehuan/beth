$(function() {
  restoreSettings();

  $('#save').on('click', function() {
    saveSettings(function() {
      chrome.runtime.sendMessage({cmd: 'reload_settings'}, function() {
        alert('保存成功');
      })
    })
  });

  $('#saveAndStart').on('click', function() {
    saveSettings(function() {
      chrome.storage.local.set({running: true}, function() {
        chrome.runtime.sendMessage({cmd: 'reload_settings'}, function() {
          chrome.runtime.sendMessage({cmd: 'start_task'});
        })
      })
    })
  })
});


function restoreSettings() {
  chrome.storage.local.get('settings', function(data) {
    if (data.settings) {

      $('#computer_name').val(data.settings.computer_name);

      document.getElementById("running").checked = data.settings.running ? true : false;

      $("#env").val(data.settings.env);
    }
  });
}

function saveSettings(callback) {
  var computer_name = $('#computer_name').val();
  var env = $('#env').val();
  var running = document.getElementById("running").checked ? true : false;

  var settings = {
    computer_name: computer_name,
    env: env,
    running: running
  };

  console.log(settings);

  chrome.storage.local.set({settings: settings}, function() {
    callback && callback();
  })
}
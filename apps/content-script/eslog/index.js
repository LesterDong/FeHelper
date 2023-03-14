(async () => {
    const src = chrome.runtime.getURL('content-script/eslog/main.js');
    const contentScript = await import(src);
    contentScript.main();
  })();
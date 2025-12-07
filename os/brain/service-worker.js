self.addEventListener("install", () => {
    console.log("BRAIN 설치됨");
    self.skipWaiting();
});

self.addEventListener("activate", () => {
    console.log("BRAIN 활성화됨");
});

self.addEventListener("fetch", () => {});

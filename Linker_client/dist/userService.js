export function fetchUserProfile() {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({
                id: 42,
                name: "Иван Петров",
                email: "ivan@example.com"
            });
        }, 500);
    });
}

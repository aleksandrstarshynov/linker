export function fetchUserProfile() {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({
                id: 42,
                name: "Oleksandr Starshynov",
                email: "aleksandrstarshynov@gmail.com"
            });
        }, 500);
    });
}

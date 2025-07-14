export interface UserProfile {
  id: number;
  name: string;
  email: string;
}

export function fetchUserProfile(): Promise<UserProfile> {
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

# AnkiWeb

![AnkiWeb Banner](Anki%20Web%20Images/Home%20Page.png)

> **Status:** 🚧 _Still in Development_

## Overview

AnkiWeb is a modern, full-stack web application inspired by the popular Anki flashcard system. Designed for efficient learning, spaced repetition, and robust deck management, AnkiWeb brings a beautiful, intuitive interface and powerful features to your browser.

## Features

- **User Authentication**: Secure login and registration system.
- **Deck Management**: Create, edit, and organize decks with ease.
- **Card Management**: Add, edit, and review cards for effective learning.
- **Study Sessions**: Continue and track your study progress seamlessly.
- **Role & Permission Management**: Fine-grained access control for users and admins.
- **Profile Management**: Update your profile, upload images, and personalize your experience.
- **Access Control**: Bind roles and permissions for advanced security.
- **Modern UI**: Responsive, clean, and user-friendly design.
- **Game Integration**: Fun learning games like Tic-Tac-Toe.

## Screenshots

| Home Page                                    | Deck Management                                               | Study Session                                             |
| -------------------------------------------- | ------------------------------------------------------------- | --------------------------------------------------------- |
| ![Home](Anki%20Web%20Images/Home%20Page.png) | ![Deck Management](Anki%20Web%20Images/Deck%20management.png) | ![Study Session](Anki%20Web%20Images/study%20session.png) |

| Add Cards                                         | Profile Management                                       | Role Permission                                                            |
| ------------------------------------------------- | -------------------------------------------------------- | -------------------------------------------------------------------------- |
| ![Add Cards](Anki%20Web%20Images/Add%20cards.png) | ![Profile](Anki%20Web%20Images/profile%20management.png) | ![Role Permission](Anki%20Web%20Images/Role%20Permission%20management.png) |

| Access Binding                                                                  | Edit Deck                                                          | Login/Register                                             |
| ------------------------------------------------------------------------------- | ------------------------------------------------------------------ | ---------------------------------------------------------- |
| ![Access Binding](Anki%20Web%20Images/Roll%20Access%20Management%20binding.png) | ![Edit Deck](Anki%20Web%20Images/deck%20management%20_%20edit.png) | ![Login/Register](Anki%20Web%20Images/loging_register.png) |

| Profile Hover                                  | Study Continuation                                                            |
| ---------------------------------------------- | ----------------------------------------------------------------------------- |
| ![Hover](Anki%20Web%20Images/just%20hover.jpg) | ![Study Continuation](Anki%20Web%20Images/Study%20session%20continuation.png) |

## Tech Stack

- **Frontend**: Next.js, React, TypeScript
- **Backend**: Node.js, Prisma ORM
- **Database**: PostgreSQL (via Prisma)
- **Authentication**: Custom middleware
- **UI Components**: Custom and Shadcn UI
- **Dockerized**: Easy deployment with Docker & Docker Compose

## Getting Started

1. **Clone the repository**
    ```sh
    git clone https://github.com/tanmoy-it/ankiweb.git
    cd ankiweb
    ```
2. **Install dependencies**
    ```sh
    npm install
    ```
3. **Set up environment variables**
    - Copy `.env.example` to `.env` and fill in your secrets.
4. **Run the app (Development)**
    ```sh
    npm run dev
    ```
5. **Run with Docker**
    ```sh
    docker-compose up --build
    ```

## Folder Structure

```
ankiweb/
├── app/                # Next.js app directory
├── components/         # UI components
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries
├── prisma/             # Prisma schema & seed
├── public/             # Static assets
├── types/              # Shared types
├── Anki Web Images/    # Project screenshots
├── uploads/            # User uploads
├── ...
```

## Contributing

Contributions are welcome! Please open issues or submit pull requests for improvements, bug fixes, or new features.

## License

This project is licensed under the MIT License.

## Acknowledgements

- Inspired by [Anki](https://apps.ankiweb.net/)
- Built with [Next.js](https://nextjs.org/), [Prisma](https://www.prisma.io/), and [Shadcn UI](https://ui.shadcn.com/)

---

> _This project is under active development. Stay tuned for more features and improvements!_

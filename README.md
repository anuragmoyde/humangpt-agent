# HumanGPT Chat Interface

A modern, responsive chat interface for HumanGPT built with React and Tailwind CSS.

## Features

- Clean, minimal UI optimized for both desktop and mobile
- Markdown support for messages
- Real-time typing indicators
- Message timestamps
- Auto-expanding input
- Responsive design
- Custom scrollbar
- Clear chat history functionality

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd humangpt
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Update the webhook URL:
Open `src/App.js` and replace the webhook URL in the `handleSubmit` function with your n8n webhook endpoint:
```javascript
const response = await fetch('https://your-n8n-server/webhook/humangpt', {
```

## Development

To start the development server:

```bash
npm start
# or
yarn start
```

The app will be available at `http://localhost:3000`.

## Building for Production

To create a production build:

```bash
npm run build
# or
yarn build
```

The build files will be created in the `build` directory.

## Usage

1. Type your message in the input field at the bottom
2. Press Enter or click the send button to submit
3. Use Shift + Enter for new lines
4. Click the trash icon in the header to clear chat history

## Customization

- Colors and styling can be modified in `tailwind.config.js`
- Font family can be changed in `src/index.css`
- Additional features can be added by modifying `src/App.js`

## License

MIT 
# VideoPlayer Component with Banner Support

The VideoPlayer component now supports showing a banner image that represents a video frame at a specific time before the video plays.

## Features

- **Banner Image**: Shows a video frame at a specified time (default: 10 seconds) as a banner before video plays
- **Automatic Frame Extraction**: Automatically extracts the frame from the video using HTML5 Canvas API
- **Fallback Support**: Falls back to the traditional play button if frame extraction fails
- **Loading States**: Shows loading indicator while extracting the frame
- **Customizable**: Configurable banner time and enable/disable functionality

## Usage

### Basic Usage (with banner at 10 seconds)
```tsx
<VideoPlayer
  src="/video/example.mp4"
  videoId="example-video"
  currentSection={currentSection}
  sectionNumber={3}
/>
```

### Custom Banner Time
```tsx
<VideoPlayer
  src="/video/example.mp4"
  videoId="example-video"
  currentSection={currentSection}
  sectionNumber={3}
  bannerTimeInSeconds={15} // Show frame at 15 seconds
/>
```

### Disable Banner
```tsx
<VideoPlayer
  src="/video/example.mp4"
  videoId="example-video"
  currentSection={currentSection}
  sectionNumber={3}
  showBanner={false} // Disable banner, show traditional play button
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | string | - | Video source URL |
| `videoId` | string | - | Unique identifier for the video |
| `className` | string | '' | Additional CSS classes |
| `onPlay` | function | - | Callback when video starts playing |
| `onPause` | function | - | Callback when video is paused |
| `currentSection` | number | - | Current section number for video management |
| `sectionNumber` | number | - | Section number this video belongs to |
| `bannerTimeInSeconds` | number | 10 | Time in seconds to extract banner frame |
| `showBanner` | boolean | true | Whether to show banner before video plays |

## How It Works

1. **Frame Extraction**: When the component mounts, it creates a temporary video element and seeks to the specified time
2. **Canvas Rendering**: The video frame is drawn to a canvas element
3. **Data URL Generation**: The canvas is converted to a data URL (base64 image)
4. **Banner Display**: The extracted frame is displayed as a banner image overlay
5. **Video Playback**: When clicked, the banner is hidden and the video starts playing

## Browser Support

- Requires HTML5 Video and Canvas support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers with video support

## Error Handling

- If frame extraction fails, falls back to traditional play button
- Shows loading indicator during frame extraction
- Graceful degradation for unsupported browsers

## Performance Considerations

- Frame extraction happens asynchronously and doesn't block the UI
- Extracted frames are cached as data URLs
- Temporary video elements are cleaned up after extraction
- Only one frame extraction per video source

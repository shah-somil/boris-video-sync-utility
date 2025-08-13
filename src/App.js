import React, { useState } from 'react';
import { Plus, Trash2, Clock, Play } from 'lucide-react';
import './App.css';

const VideoSyncUtility = () => {
  const [videos, setVideos] = useState([
    { id: 1, name: 'Video 1', duration: '1:20:48', syncPoint: '11:38' },
    { id: 2, name: 'Video 2', duration: '45:30', syncPoint: '9:50' },
    { id: 3, name: 'Video 3', duration: '52:15', syncPoint: '8:57' }
  ]);

  // Convert time string (HH:MM:SS or MM:SS) to seconds
  const timeToSeconds = (timeStr) => {
    if (!timeStr) return 0;
    const parts = timeStr.split(':').map(Number);
    if (parts.length === 3) {
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
    } else if (parts.length === 2) {
      return parts[0] * 60 + parts[1];
    }
    return 0;
  };

  // Convert seconds to time string
  const secondsToTime = (seconds) => {
    const hours = Math.floor(Math.abs(seconds) / 3600);
    const minutes = Math.floor((Math.abs(seconds) % 3600) / 60);
    const secs = Math.abs(seconds) % 60;
    
    const sign = seconds < 0 ? '-' : '';
    
    if (hours > 0) {
      return `${sign}${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${sign}${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate sync data
  const calculateSync = () => {
    const videoData = videos.map(video => ({
      ...video,
      durationSeconds: timeToSeconds(video.duration),
      syncPointSeconds: timeToSeconds(video.syncPoint)
    }));

    // Find the longest video (reference)
    const referenceVideo = videoData.reduce((prev, current) => 
      current.durationSeconds > prev.durationSeconds ? current : prev
    );

    // Calculate offsets
    const syncData = videoData.map(video => ({
      ...video,
      isReference: video.id === referenceVideo.id,
      offset: referenceVideo.syncPointSeconds - video.syncPointSeconds,
      startTime: referenceVideo.syncPointSeconds - video.syncPointSeconds
    }));

    return { syncData, referenceVideo };
  };

  const { syncData, referenceVideo } = calculateSync();

  const addVideo = () => {
    const newId = Math.max(...videos.map(v => v.id)) + 1;
    setVideos([...videos, { 
      id: newId, 
      name: `Video ${newId}`, 
      duration: '30:00', 
      syncPoint: '5:00' 
    }]);
  };

  const removeVideo = (id) => {
    if (videos.length > 1) {
      setVideos(videos.filter(v => v.id !== id));
    }
  };

  const updateVideo = (id, field, value) => {
    setVideos(videos.map(v => 
      v.id === id ? { ...v, [field]: value } : v
    ));
  };

  // Calculate timeline visualization
  const maxDuration = Math.max(...syncData.map(v => v.durationSeconds));
  const minStart = Math.min(...syncData.map(v => v.startTime));
  const maxEnd = Math.max(...syncData.map(v => v.startTime + v.durationSeconds));
  const timelineRange = maxEnd - minStart;

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Video Sync Utility</h1>
        <p className="text-gray-600">Synchronize multiple videos based on timeline sync points</p>
      </div>

      {/* Video Input Section */}
      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Videos</h2>
          <button
            onClick={addVideo}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={16} />
            Add Video
          </button>
        </div>

        <div className="space-y-4">
          {videos.map((video) => (
            <div key={video.id} className="flex items-center gap-4 p-4 bg-white rounded-lg border">
              <input
                type="text"
                value={video.name}
                onChange={(e) => updateVideo(video.id, 'name', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Video name"
              />
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-gray-400" />
                <input
                  type="text"
                  value={video.duration}
                  onChange={(e) => updateVideo(video.id, 'duration', e.target.value)}
                  className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="HH:MM:SS"
                />
              </div>
              <div className="flex items-center gap-2">
                <Play size={16} className="text-gray-400" />
                <input
                  type="text"
                  value={video.syncPoint}
                  onChange={(e) => updateVideo(video.id, 'syncPoint', e.target.value)}
                  className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="MM:SS"
                />
              </div>
              {videos.length > 1 && (
                <button
                  onClick={() => removeVideo(video.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Results Section */}
      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Sync Results</h2>
        
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-2 bg-green-100 text-green-800 rounded-lg">
            <Clock size={16} />
            Reference: {referenceVideo?.name} (longest duration: {referenceVideo?.duration})
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-lg border">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Video</th>
                <th className="px-4 py-3 text-left font-semibold">Duration</th>
                <th className="px-4 py-3 text-left font-semibold">Sync Point</th>
                <th className="px-4 py-3 text-left font-semibold">Offset</th>
                <th className="px-4 py-3 text-left font-semibold">Start Time</th>
              </tr>
            </thead>
            <tbody>
              {syncData.map((video) => (
                <tr key={video.id} className={`border-t ${video.isReference ? 'bg-green-50' : ''}`}>
                  <td className="px-4 py-3 font-medium">
                    {video.name}
                    {video.isReference && (
                      <span className="ml-2 px-2 py-1 text-xs bg-green-200 text-green-800 rounded">
                        Reference
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">{video.duration}</td>
                  <td className="px-4 py-3">{video.syncPoint}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-sm ${
                      video.offset === 0 
                        ? 'bg-green-100 text-green-800' 
                        : video.offset > 0 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-orange-100 text-orange-800'
                    }`}>
                      {video.offset === 0 ? '0s (reference)' : `${video.offset > 0 ? '+' : ''}${video.offset}s`}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {video.startTime === 0 ? '0:00' : secondsToTime(video.startTime)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Timeline Visualization */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Timeline Visualization</h2>
        
        <div className="relative">
          {/* Timeline ruler */}
          <div className="h-8 bg-gray-200 rounded-lg mb-4 relative">
            <div className="absolute left-0 top-0 h-full w-1 bg-red-500 rounded-l-lg" />
            <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-gray-600">
              Sync Point
            </div>
          </div>

          {/* Video bars */}
          <div className="space-y-3">
            {syncData.map((video) => {
              const startPercent = ((video.startTime - minStart) / timelineRange) * 100;
              const widthPercent = (video.durationSeconds / timelineRange) * 100;
              
              return (
                <div key={video.id} className="relative">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="w-20 text-sm font-medium truncate">{video.name}</span>
                    <span className="text-xs text-gray-500">
                      Start: {video.startTime === 0 ? '0:00' : secondsToTime(video.startTime)}
                    </span>
                  </div>
                  <div className="h-6 bg-gray-200 rounded-lg relative">
                    <div
                      className={`absolute h-full rounded-lg ${
                        video.isReference ? 'bg-green-500' : 'bg-blue-500'
                      }`}
                      style={{
                        left: `${Math.max(0, startPercent)}%`,
                        width: `${Math.min(widthPercent, 100 - Math.max(0, startPercent))}%`
                      }}
                    />
                    {/* Sync point marker */}
                    <div
                      className="absolute top-0 w-1 h-full bg-red-500"
                      style={{
                        left: `${((referenceVideo.syncPointSeconds - minStart) / timelineRange) * 100}%`
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span>Reference video</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span>Other videos</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1 h-4 bg-red-500"></div>
              <span>Sync point</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoSyncUtility;
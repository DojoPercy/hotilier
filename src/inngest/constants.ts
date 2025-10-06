const Events = {
    // Original content processing
    fetchSummarizeAndStoreContent: 'fetch-summarize-and-store-content',
    
    // Enhanced content processing
    realtimeContentProcessing: 'realtime-content-processing',
    batchContentProcessing: 'batch-content-processing',
    contentQualityAssessment: 'content-quality-assessment',
    
    // User engagement events
    userContentInteraction: 'user-content-interaction',
    personalizedRecommendations: 'personalized-recommendations',
    
    // Content lifecycle events
    contentPublished: 'content-published',
    contentUpdated: 'content-updated',
    contentArchived: 'content-archived',
    
    // AI analysis events
    contentAnalysisComplete: 'content-analysis-complete',
    trendAnalysisUpdate: 'trend-analysis-update',
    
    // Notification events
    contentProcessingStarted: 'content.processing.started',
    contentProcessingProgress: 'content.processing.progress',
    contentProcessingCompleted: 'content.processing.completed',
    
    // Error handling
    contentProcessingFailed: 'content.processing.failed',
    retryContentProcessing: 'retry-content-processing'
}

export default Events;
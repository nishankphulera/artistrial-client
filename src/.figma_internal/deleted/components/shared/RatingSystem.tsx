import React, { useState } from 'react';
import { Star, MessageCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';

interface Review {
  id: string;
  user_id: string;
  user_name: string;
  user_avatar?: string;
  rating: number;
  comment: string;
  created_at: string;
  helpful_count: number;
}

interface RatingSystemProps {
  entityId: string;
  entityType: 'talent' | 'asset' | 'studio' | 'legal_service';
  averageRating: number;
  totalReviews: number;
  reviews: Review[];
  canReview?: boolean;
  onSubmitReview?: (rating: number, comment: string) => Promise<void>;
}

export function RatingSystem({
  entityId,
  entityType,
  averageRating,
  totalReviews,
  reviews,
  canReview = false,
  onSubmitReview
}: RatingSystemProps) {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmitReview = async () => {
    if (!onSubmitReview || rating === 0) return;
    
    setSubmitting(true);
    try {
      await onSubmitReview(rating, comment);
      setShowReviewForm(false);
      setRating(0);
      setComment('');
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const StarRating = ({ value, interactive = false, onRate }: { 
    value: number; 
    interactive?: boolean; 
    onRate?: (rating: number) => void; 
  }) => (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            star <= value
              ? 'fill-yellow-400 text-yellow-400'
              : 'text-gray-300'
          } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
          onClick={() => interactive && onRate && onRate(star)}
        />
      ))}
    </div>
  );

  const getRatingDistribution = () => {
    const distribution = [0, 0, 0, 0, 0];
    reviews.forEach(review => {
      if (review.rating >= 1 && review.rating <= 5) {
        distribution[review.rating - 1]++;
      }
    });
    return distribution;
  };

  const distribution = getRatingDistribution();

  return (
    <div className="space-y-6">
      {/* Overall Rating Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Reviews & Ratings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Rating Overview */}
            <div className="text-center">
              <div className="mb-2">
                <span className="text-3xl font-bold">{averageRating.toFixed(1)}</span>
                <span className="text-muted-foreground ml-1">out of 5</span>
              </div>
              <StarRating value={Math.round(averageRating)} />
              <p className="text-sm text-muted-foreground mt-1">
                Based on {totalReviews} review{totalReviews !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((stars) => (
                <div key={stars} className="flex items-center gap-2 text-sm">
                  <span className="w-3">{stars}</span>
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full"
                      style={{
                        width: totalReviews > 0 ? `${(distribution[stars - 1] / totalReviews) * 100}%` : '0%'
                      }}
                    />
                  </div>
                  <span className="w-8 text-right">{distribution[stars - 1]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Write Review Button */}
          {canReview && !showReviewForm && (
            <Button
              onClick={() => setShowReviewForm(true)}
              className="w-full mt-4"
              variant="outline"
            >
              Write a Review
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Review Form */}
      {showReviewForm && (
        <Card>
          <CardHeader>
            <CardTitle>Write a Review</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block mb-2">Rating</label>
              <StarRating 
                value={rating} 
                interactive 
                onRate={setRating}
              />
            </div>
            
            <div>
              <label className="block mb-2">Comment</label>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience..."
                rows={4}
              />
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={handleSubmitReview}
                disabled={rating === 0 || submitting}
                className="flex-1"
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowReviewForm(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={review.user_avatar} alt={review.user_name} />
                  <AvatarFallback>{review.user_name.charAt(0)}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium">{review.user_name}</p>
                      <div className="flex items-center gap-2">
                        <StarRating value={review.rating} />
                        <span className="text-sm text-muted-foreground">
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <Badge variant="secondary">{review.rating}.0</Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3">{review.comment}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <button className="hover:text-foreground">
                      👍 Helpful ({review.helpful_count})
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {reviews.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No reviews yet. Be the first to share your experience!</p>
          </div>
        )}
      </div>
    </div>
  );
}


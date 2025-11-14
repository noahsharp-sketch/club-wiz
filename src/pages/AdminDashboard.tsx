import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Download, Star } from "lucide-react";

interface FeedbackData {
  id: string;
  rating: number;
  feedback_text: string | null;
  created_at: string;
  profiles: {
    email: string;
  } | null;
}

const AdminDashboard = () => {
  const [feedback, setFeedback] = useState<FeedbackData[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .single();

      if (error || !data) {
        toast({
          title: "Access Denied",
          description: "You don't have permission to access this page.",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      setIsAdmin(true);
      loadFeedback();
    };

    checkAdminStatus();
  }, [user, navigate, toast]);

  const loadFeedback = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('user_feedback')
      .select(`
        id,
        rating,
        feedback_text,
        created_at,
        user_id
      `)
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load feedback data.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    // Fetch user emails separately
    const feedbackWithProfiles = await Promise.all(
      (data || []).map(async (f) => {
        if (f.user_id) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('email')
            .eq('id', f.user_id)
            .single();
          
          return { ...f, profiles: profile };
        }
        return { ...f, profiles: null };
      })
    );

    setFeedback(feedbackWithProfiles as FeedbackData[]);
    setLoading(false);
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Email', 'Rating', 'Feedback'];
    const rows = feedback.map(f => [
      new Date(f.created_at).toLocaleDateString(),
      f.profiles?.email || 'Anonymous',
      f.rating,
      f.feedback_text || ''
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `feedback-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (!isAdmin || loading) {
    return null;
  }

  const averageRating = feedback.length > 0
    ? (feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length).toFixed(1)
    : 0;

  return (
    <div className="min-h-screen">
      <Header />
      <div className="pt-20 pb-20">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Customer feedback and satisfaction analytics</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Feedback
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{feedback.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Average Rating
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <div className="text-3xl font-bold text-foreground">{averageRating}</div>
                  <Star className="h-6 w-6 fill-primary text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button onClick={exportToCSV} className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Export CSV
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>User Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Feedback</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {feedback.map((f) => (
                    <TableRow key={f.id}>
                      <TableCell>
                        {new Date(f.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {f.profiles?.email || (
                          <Badge variant="outline">Anonymous</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: f.rating }).map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-md">
                        {f.feedback_text || (
                          <span className="text-muted-foreground italic">No additional feedback</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminDashboard;

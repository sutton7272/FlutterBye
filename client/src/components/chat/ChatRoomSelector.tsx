import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Hash, Users, Plus, Lock, Globe, Crown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ChatRoom {
  id: string;
  name: string;
  description?: string;
  isPublic: boolean;
  maxParticipants: number;
  currentParticipants?: number;
  createdBy: string;
  createdAt: string;
  isOwner?: boolean;
  hasPassword?: boolean;
  category?: string;
}

interface ChatRoomSelectorProps {
  selectedRoom: string | null;
  onRoomSelect: (roomId: string) => void;
  userWallet: string;
}

export function ChatRoomSelector({ selectedRoom, onRoomSelect, userWallet }: ChatRoomSelectorProps) {
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomDescription, setNewRoomDescription] = useState('');
  const [newRoomPassword, setNewRoomPassword] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch available chat rooms
  const { data: rooms = [], isLoading } = useQuery({
    queryKey: ['/api/chat/rooms'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/chat/rooms');
      return response as ChatRoom[];
    }
  });

  // Create new room mutation
  const createRoomMutation = useMutation({
    mutationFn: async (roomData: {
      name: string;
      description?: string;
      isPublic: boolean;
      password?: string;
    }) => {
      return apiRequest('POST', '/api/chat/rooms', roomData);
    },
    onSuccess: (newRoom: ChatRoom) => {
      queryClient.invalidateQueries({ queryKey: ['/api/chat/rooms'] });
      onRoomSelect(newRoom.id);
      setIsCreatingRoom(false);
      setNewRoomName('');
      setNewRoomDescription('');
      setNewRoomPassword('');
      toast({
        title: "Room Created",
        description: `Successfully created "${newRoom.name}"`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create room. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleCreateRoom = () => {
    if (!newRoomName.trim()) {
      toast({
        title: "Error",
        description: "Room name is required",
        variant: "destructive",
      });
      return;
    }

    createRoomMutation.mutate({
      name: newRoomName.trim(),
      description: newRoomDescription.trim() || undefined,
      isPublic,
      password: !isPublic && newRoomPassword ? newRoomPassword : undefined,
    });
  };

  // Filter rooms based on search
  const filteredRooms = rooms.filter(room =>
    room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Categorize rooms
  const publicRooms = filteredRooms.filter(room => room.isPublic);
  const privateRooms = filteredRooms.filter(room => !room.isPublic);
  const myRooms = filteredRooms.filter(room => room.createdBy === userWallet);

  const getRoomIcon = (room: ChatRoom) => {
    if (room.createdBy === userWallet) return <Crown className="w-4 h-4 text-yellow-400" />;
    if (!room.isPublic) return <Lock className="w-4 h-4 text-red-400" />;
    return <Globe className="w-4 h-4 text-green-400" />;
  };

  const getRoomBadges = (room: ChatRoom) => {
    const badges = [];
    
    if (room.createdBy === userWallet) {
      badges.push(<Badge key="owner" className="bg-yellow-500/20 text-yellow-400 text-xs">Owner</Badge>);
    }
    
    if (room.currentParticipants && room.currentParticipants > 10) {
      badges.push(<Badge key="active" className="bg-green-500/20 text-green-400 text-xs">Active</Badge>);
    }
    
    if (room.hasPassword) {
      badges.push(<Badge key="protected" className="bg-red-500/20 text-red-400 text-xs">Protected</Badge>);
    }

    return badges;
  };

  return (
    <Card className="bg-slate-900/50 border-purple-500/20 h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-purple-400">
            <Hash className="w-5 h-5" />
            Chat Rooms
          </CardTitle>
          
          <Dialog open={isCreatingRoom} onOpenChange={setIsCreatingRoom}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-gradient-to-r from-purple-600 to-blue-600">
                <Plus className="w-4 h-4 mr-1" />
                Create
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-purple-500/20">
              <DialogHeader>
                <DialogTitle className="text-purple-400">Create New Room</DialogTitle>
                <DialogDescription className="text-gray-400">
                  Create a new chat room for your community
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-purple-400 block mb-1">
                    Room Name *
                  </label>
                  <Input
                    value={newRoomName}
                    onChange={(e) => setNewRoomName(e.target.value)}
                    placeholder="Enter room name..."
                    className="bg-slate-800 border-purple-500/20 text-white"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-purple-400 block mb-1">
                    Description
                  </label>
                  <Textarea
                    value={newRoomDescription}
                    onChange={(e) => setNewRoomDescription(e.target.value)}
                    placeholder="Describe your room..."
                    className="bg-slate-800 border-purple-500/20 text-white"
                    rows={3}
                  />
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      id="public"
                      checked={isPublic}
                      onChange={() => setIsPublic(true)}
                      className="text-purple-500"
                    />
                    <label htmlFor="public" className="text-sm text-gray-300">
                      Public Room
                    </label>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      id="private"
                      checked={!isPublic}
                      onChange={() => setIsPublic(false)}
                      className="text-purple-500"
                    />
                    <label htmlFor="private" className="text-sm text-gray-300">
                      Private Room
                    </label>
                  </div>
                </div>
                
                {!isPublic && (
                  <div>
                    <label className="text-sm font-medium text-purple-400 block mb-1">
                      Password (optional)
                    </label>
                    <Input
                      type="password"
                      value={newRoomPassword}
                      onChange={(e) => setNewRoomPassword(e.target.value)}
                      placeholder="Room password..."
                      className="bg-slate-800 border-purple-500/20 text-white"
                    />
                  </div>
                )}
                
                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleCreateRoom}
                    disabled={createRoomMutation.isPending}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600"
                  >
                    {createRoomMutation.isPending ? 'Creating...' : 'Create Room'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsCreatingRoom(false)}
                    className="border-purple-500/20 text-gray-300"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        {/* Search */}
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search rooms..."
          className="bg-slate-800 border-purple-500/20 text-white"
        />
      </CardHeader>
      
      <CardContent>
        <ScrollArea className="h-[400px]">
          <div className="space-y-4">
            {/* My Rooms */}
            {myRooms.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-yellow-400 mb-2 flex items-center gap-1">
                  <Crown className="w-3 h-3" />
                  My Rooms
                </h3>
                <div className="space-y-2">
                  {myRooms.map(room => (
                    <div
                      key={room.id}
                      onClick={() => onRoomSelect(room.id)}
                      className={`p-3 rounded-lg cursor-pointer transition-colors border ${
                        selectedRoom === room.id
                          ? 'bg-purple-900/20 border-purple-500/40'
                          : 'bg-slate-800/30 border-slate-700/50 hover:bg-slate-800/50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          {getRoomIcon(room)}
                          <span className="font-medium text-white">{room.name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-400">
                            {room.currentParticipants || 0}
                          </span>
                        </div>
                      </div>
                      
                      {room.description && (
                        <p className="text-xs text-gray-400 mb-2">{room.description}</p>
                      )}
                      
                      <div className="flex flex-wrap gap-1">
                        {getRoomBadges(room)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Public Rooms */}
            {publicRooms.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-green-400 mb-2 flex items-center gap-1">
                  <Globe className="w-3 h-3" />
                  Public Rooms
                </h3>
                <div className="space-y-2">
                  {publicRooms.filter(room => room.createdBy !== userWallet).map(room => (
                    <div
                      key={room.id}
                      onClick={() => onRoomSelect(room.id)}
                      className={`p-3 rounded-lg cursor-pointer transition-colors border ${
                        selectedRoom === room.id
                          ? 'bg-purple-900/20 border-purple-500/40'
                          : 'bg-slate-800/30 border-slate-700/50 hover:bg-slate-800/50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          {getRoomIcon(room)}
                          <span className="font-medium text-white">{room.name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-400">
                            {room.currentParticipants || 0}
                          </span>
                        </div>
                      </div>
                      
                      {room.description && (
                        <p className="text-xs text-gray-400 mb-2">{room.description}</p>
                      )}
                      
                      <div className="flex flex-wrap gap-1">
                        {getRoomBadges(room)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Private Rooms */}
            {privateRooms.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-red-400 mb-2 flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  Private Rooms
                </h3>
                <div className="space-y-2">
                  {privateRooms.filter(room => room.createdBy !== userWallet).map(room => (
                    <div
                      key={room.id}
                      onClick={() => onRoomSelect(room.id)}
                      className={`p-3 rounded-lg cursor-pointer transition-colors border ${
                        selectedRoom === room.id
                          ? 'bg-purple-900/20 border-purple-500/40'
                          : 'bg-slate-800/30 border-slate-700/50 hover:bg-slate-800/50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          {getRoomIcon(room)}
                          <span className="font-medium text-white">{room.name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-400">
                            {room.currentParticipants || 0}
                          </span>
                        </div>
                      </div>
                      
                      {room.description && (
                        <p className="text-xs text-gray-400 mb-2">{room.description}</p>
                      )}
                      
                      <div className="flex flex-wrap gap-1">
                        {getRoomBadges(room)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {isLoading && (
              <div className="text-center text-gray-400 py-8">
                Loading rooms...
              </div>
            )}
            
            {!isLoading && filteredRooms.length === 0 && (
              <div className="text-center text-gray-400 py-8">
                {searchTerm ? 'No rooms found matching your search.' : 'No rooms available. Create one to get started!'}
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
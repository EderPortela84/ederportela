import { Home, Users, MapPin, Shield, Bell, Settings, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import tvilleLogo from '@/assets/t-ville-logo.png';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";

const Navbar = () => {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <nav className="sticky top-0 z-50 w-full border-b bg-card/80 backdrop-blur-md">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
          </div>
        </div>
      </nav>
    );
  }

  if (!user) {
    return (
      <nav className="sticky top-0 z-50 w-full border-b bg-card/80 backdrop-blur-md">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center space-x-3">
              <img src={tvilleLogo} alt="T-Ville" className="h-10 w-10 object-contain" />
              <div>
                <h1 className="text-xl font-bold bg-gradient-city bg-clip-text text-transparent">
                  T-Ville
                </h1>
                <p className="text-xs text-muted-foreground">Sua comunidade urbana</p>
              </div>
            </Link>
            <Button asChild className="bg-gradient-city hover:shadow-glow">
              <Link to="/auth">Entrar na Cidade</Link>
            </Button>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-card/80 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img src={tvilleLogo} alt="T-Ville" className="h-10 w-10 object-contain" />
            <div>
              <h1 className="text-xl font-bold bg-gradient-city bg-clip-text text-transparent">
                T-Ville
              </h1>
              <p className="text-xs text-muted-foreground">Sua comunidade urbana</p>
            </div>
          </Link>

          {/* Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            <Button variant="ghost" className="flex items-center space-x-2" asChild>
              <Link to="/">
                <Home className="h-4 w-4" />
                <span>Praça Central</span>
              </Link>
            </Button>
            <Button variant="ghost" className="flex items-center space-x-2" asChild>
              <Link to="/vizinhanca">
                <Users className="h-4 w-4" />
                <span>Vizinhança</span>
              </Link>
            </Button>
            <Button variant="ghost" className="flex items-center space-x-2 relative" asChild>
              <Link to="/delegacia">
                <Shield className="h-4 w-4" />
                <span>Delegacia</span>
              </Link>
            </Button>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-4 w-4" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-accent p-0 text-xs">
                3
              </Badge>
            </Button>
            
            <Button variant="ghost" size="icon">
              <Settings className="h-4 w-4" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 pl-2 border-l">
                  <Avatar className="h-8 w-8 ring-2 ring-primary/20">
                    <AvatarImage src="" alt="Sua Casa" />
                    <AvatarFallback className="bg-gradient-sunset text-white">
                      {user.email?.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden lg:block text-left">
                    <p className="text-sm font-medium">Minha Casa</p>
                    <p className="text-xs text-muted-foreground">Cidadão Ativo</p>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link to="/casa" className="cursor-pointer">
                    <Home className="h-4 w-4 mr-2" />
                    Minha Casa
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="h-4 w-4 mr-2" />
                  Configurações
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={signOut}
                  className="cursor-pointer text-destructive focus:text-destructive"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair da Cidade
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
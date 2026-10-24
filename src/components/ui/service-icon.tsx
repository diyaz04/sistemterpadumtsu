import * as React from "react";
import {
  Globe,
  Wallet,
  Users,
  BookOpen,
  FileCheck,
  Megaphone,
  School,
  GraduationCap,
  Library,
  Compass,
  FileText,
  Calendar,
  Settings,
  HelpCircle,
  ExternalLink,
  ShieldCheck,
  Book,
  Award,
  Laptop,
  Monitor,
  Building,
  Building2,
  MessageSquare,
  Phone,
  MapPin,
  CreditCard,
  Layers,
  Briefcase,
  Clock,
  Sparkles,
  Search,
  UserCheck,
  ClipboardList,
  FolderOpen,
  Send,
  type LucideProps,
} from "lucide-react";

export interface ServiceIconProps extends Omit<LucideProps, "name"> {
  name?: string | null;
}

export function ServiceIcon({ name, ...props }: ServiceIconProps) {
  const key = name ? name.toLowerCase().replace(/[-_ ]/g, "") : "globe";

  switch (key) {
    case "wallet":
      return <Wallet {...props} />;
    case "users":
      return <Users {...props} />;
    case "bookopen":
      return <BookOpen {...props} />;
    case "filecheck":
      return <FileCheck {...props} />;
    case "megaphone":
      return <Megaphone {...props} />;
    case "school":
      return <School {...props} />;
    case "graduationcap":
      return <GraduationCap {...props} />;
    case "library":
      return <Library {...props} />;
    case "compass":
      return <Compass {...props} />;
    case "filetext":
      return <FileText {...props} />;
    case "calendar":
      return <Calendar {...props} />;
    case "settings":
      return <Settings {...props} />;
    case "helpcircle":
      return <HelpCircle {...props} />;
    case "externallink":
      return <ExternalLink {...props} />;
    case "shieldcheck":
      return <ShieldCheck {...props} />;
    case "book":
      return <Book {...props} />;
    case "award":
      return <Award {...props} />;
    case "laptop":
      return <Laptop {...props} />;
    case "monitor":
      return <Monitor {...props} />;
    case "building":
      return <Building {...props} />;
    case "building2":
      return <Building2 {...props} />;
    case "messagesquare":
      return <MessageSquare {...props} />;
    case "phone":
      return <Phone {...props} />;
    case "mappin":
      return <MapPin {...props} />;
    case "creditcard":
      return <CreditCard {...props} />;
    case "layers":
      return <Layers {...props} />;
    case "briefcase":
      return <Briefcase {...props} />;
    case "clock":
      return <Clock {...props} />;
    case "sparkles":
      return <Sparkles {...props} />;
    case "search":
      return <Search {...props} />;
    case "usercheck":
      return <UserCheck {...props} />;
    case "clipboardlist":
      return <ClipboardList {...props} />;
    case "folderopen":
      return <FolderOpen {...props} />;
    case "send":
      return <Send {...props} />;
    case "globe":
    default:
      return <Globe {...props} />;
  }
}

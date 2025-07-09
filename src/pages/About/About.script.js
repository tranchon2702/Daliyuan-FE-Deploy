import { Heart, Award, Users, Clock } from "lucide-react";

export const values = (t) => [
  {
    icon: Heart,
    title: t('about_page.values.passion.title'),
    description: t('about_page.values.passion.description')
  },
  {
    icon: Award,
    title: t('about_page.values.quality.title'),
    description: t('about_page.values.quality.description')
  },
  {
    icon: Users,
    title: t('about_page.values.customer.title'),
    description: t('about_page.values.customer.description')
  },
  {
    icon: Clock,
    title: t('about_page.values.tradition.title'),
    description: t('about_page.values.tradition.description')
  }
]; 
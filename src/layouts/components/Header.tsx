import { ChevronLeftIcon, MagnifyingGlassIcon, UserIcon } from '@heroicons/react/24/outline'
import { useCurrentRoute } from "@/contexts/route/useCurrentRoute";
import { useMemo, useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SearchWithHistory from './SearchWithHistory';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useBack } from "@/hooks/useBack";
import { motion, AnimatePresence } from 'framer-motion';
import { useUserContext } from '@/contexts/user/userContext';
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Header() {
  

  return (
    <header className="relative  border-b-[1px] border-[#EFEFEF] dark:bg-gray-800/50 dark:shadow-none bg-accent">
     


    </header>
  );
}

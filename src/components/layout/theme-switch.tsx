"use client";

import { useTheme } from 'next-themes';
import { Button } from '../ui/button';
import React from 'react'
import { Moon, Sun } from 'lucide-react';

export default function ThemeSwitch() {
    const { setTheme, theme } = useTheme();
  return (
        <Button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            {theme === 'dark' ? <Moon /> : <Sun />}
        </Button>
  )
}
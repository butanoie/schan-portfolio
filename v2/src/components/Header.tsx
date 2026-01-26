"use client";

import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  const navItems = [
    { label: "Portfolio", href: "/" },
    { label: "Resume", href: "/resume" },
    { label: "Colophon", href: "/colophon" },
  ];

  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, fontFamily: "Oswald" }}
        >
          Sing Chan
        </Typography>
        <Box component="nav" aria-label="Main navigation">
          {navItems.map((item) => (
            <Button
              key={item.href}
              component={Link}
              href={item.href}
              aria-current={pathname === item.href ? "page" : undefined}
              sx={{
                mx: 1,
                color: "text.primary",
                textDecoration: pathname === item.href ? "underline" : "none",
              }}
            >
              {item.label}
            </Button>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

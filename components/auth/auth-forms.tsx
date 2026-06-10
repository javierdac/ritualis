"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginUser, registerUser, type ActionState } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function LoginForm() {
  const [state, action, pending] = useActionState<ActionState, FormData>(
    loginUser,
    undefined,
  );

  return (
    <Card className="border-border/70 shadow-xl">
      <CardHeader>
        <CardTitle>Iniciar sesión</CardTitle>
        <CardDescription>Entrá con tu email y contraseña.</CardDescription>
      </CardHeader>
      <form action={action}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required autoComplete="email" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
            />
          </div>
          {state?.error && (
            <p className="text-sm text-destructive">{state.error}</p>
          )}
        </CardContent>
        <CardFooter className="mt-6 flex flex-col gap-3">
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Entrando…" : "Entrar"}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            ¿No tenés cuenta?{" "}
            <Link href="/register" className="text-primary hover:underline">
              Registrate
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}

export function RegisterForm() {
  const [state, action, pending] = useActionState<ActionState, FormData>(
    registerUser,
    undefined,
  );

  return (
    <Card className="border-border/70 shadow-xl">
      <CardHeader>
        <CardTitle>Crear cuenta</CardTitle>
        <CardDescription>Registrate para empezar a facilitar.</CardDescription>
      </CardHeader>
      <form action={action}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <Input id="name" name="name" required autoComplete="name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required autoComplete="email" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
              autoComplete="new-password"
            />
          </div>
          {state?.error && (
            <p className="text-sm text-destructive">{state.error}</p>
          )}
        </CardContent>
        <CardFooter className="mt-6 flex flex-col gap-3">
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Creando…" : "Crear cuenta"}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            ¿Ya tenés cuenta?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Iniciá sesión
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}

import { test, expect } from "@playwright/test";

test("test", async ({ page }) => {
  // Navigue vers l'URL de l'application
  await page.goto("http://localhost:5173");

  // Vérifie que le champ de saisie pour le pseudo est visible
  await expect(
    page.getByRole("heading", { level: 1, name: "Entrez votre pseudo :" })
  ).toBeVisible();

  // Vérifie que le champ de saisie pour le message est visible
  await expect(
    page.getByRole("heading", { level: 1, name: "Entrez votre pseudo :" })
  ).toBeVisible();

  // Vérifie que le bouton "Valider" est visible
  await expect(page.getByRole("button", { name: "Valider" })).toBeVisible();

  await page.getByRole("textbox", { name: "Votre pseudo" }).click();
  await page.getByRole("textbox", { name: "Votre pseudo" }).fill("Jean");
  await page.getByRole("textbox", { name: "Votre pseudo" }).press("Enter");

  // Vérifie que le bouton "Envoyer" est visible
  await expect(page.getByRole("button", { name: "Envoyer" })).toBeVisible();

  // Vérifie que le message "Entrez votre pseudo :" est visible
  await expect(page.getByPlaceholder("Votre message")).toBeVisible();

  // Vérifie que le message "Chat - Connecté en tant que" est visible
  await expect(page.getByText("Chat - Connecté en tant que")).toBeVisible();

  // Vérifie que le message "Vous êtes connecté en tant qu'administrateur." n'est pas visible
  await expect(
    page.getByText("Vous êtes connecté en tant qu'administrateur.")
  ).not.toBeVisible();

  await page.getByRole("textbox", { name: "Votre message" }).click();
  await page.getByRole("textbox", { name: "Votre message" }).fill("salut");
  await page.getByRole("textbox", { name: "Votre message" }).press("Enter");

  // Vérifie que le message "salut" est affiché dans la liste des messages
  await expect(page.locator(".message", { hasText: "Jean" })).toContainText(
    "salut"
  );
});

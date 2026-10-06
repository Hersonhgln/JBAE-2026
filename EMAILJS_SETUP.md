# 📧 Guide d'activation de l'Envoi d'E-mails (EmailJS) - JBAE 2026

Le système d'envoi d'e-mails est déjà **totalement intégré** dans le code source de votre site ([app.js](file:///c:/Users/Dell/Documents/JBAE%202026/app.js) et [index.html](file:///c:/Users/Dell/Documents/JBAE%202026/index.html)).

Pour activer l'envoi réel en boîte de réception sans aucun serveur, suivez ces 4 étapes simples (environ 3 minutes) :

---

### Étape 1 : Créer votre compte gratuit
1. Rendez-vous sur [https://www.emailjs.com/](https://www.emailjs.com/) et cliquez sur **Sign Up Free** (Gratuit jusqu'à 200 emails / mois).
2. Validez votre adresse e-mail.

---

### Étape 2 : Connecter votre boîte d'envoi (Email Service)
1. Dans le menu de gauche, allez dans **Email Services** -> **Add New Service**.
2. Choisissez votre fournisseur habituel (ex: **Gmail**, **Outlook** ou tout autre compte SMTP).
3. Cliquez sur **Connect Account** et validez l'accès.
4. Notez votre **Service ID** (ex: `service_jbae2026`).

---

### Étape 3 : Créer le modèle d'e-mail (Email Template)
1. Dans le menu de gauche, allez dans **Email Templates** -> **Create New Template**.
2. Configurez les champs d'en-tête (en haut de l'éditeur EmailJS) :
   - **To Email** : `{{to_email}}`
   - **Cc** (ou BCC) : `{{cc_email}}` *(soit gfaton251@gmail.com)*
   - **From Name** : `Comité JBAE 2026`
   - **Subject** : `Confirmation de votre inscription - JBAE 2026 (Modalités de paiement)`
3. Dans le corps du message (**Content / HTML**), collez le modèle suivant :

```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2ece9; border-radius: 12px; overflow: hidden;">
    <div style="background: #1E3A2B; padding: 25px; text-align: center; color: #ffffff;">
        <h1 style="margin: 0; font-size: 22px; color: #E9C46A;">Journée Béninoise de l'Agroécologie 2026</h1>
        <p style="margin: 5px 0 0 0; font-size: 14px; opacity: 0.9;">2ᵉ Édition - Comité Génération Lumière & D'Natures</p>
    </div>

    <div style="padding: 25px; color: #1A2421; line-height: 1.6;">
        <p>Bonjour <strong>{{to_name}}</strong>,</p>
        
        <p>Nous avons bien enregistré votre demande d'inscription pour la <strong>JBAE 2026</strong>. Merci pour votre engagement en faveur de la transition agroécologique au Bénin !</p>

        <div style="background: #EDF7F2; border-left: 4px solid #2D6A4F; padding: 15px; margin: 20px 0; border-radius: 6px;">
            <h3 style="margin-top: 0; color: #1E3A2B; font-size: 16px;">📋 Récapitulatif de votre commande :</h3>
            <ul style="list-style: none; padding-left: 0; margin-bottom: 0;">
                <li>🏷️ <strong>Formule :</strong> {{pack_name}}</li>
                <li>💰 <strong>Montant à régler :</strong> <span style="color: #2D6A4F; font-size: 18px; font-weight: bold;">{{amount}}</span></li>
                <li>🎯 <strong>Profil :</strong> {{category}}</li>
                <li>📱 <strong>Téléphone :</strong> {{phone}}</li>
            </ul>
        </div>

        <div style="background: #FFF8E7; border: 1px solid #E9C46A; padding: 18px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #8B5A2B; font-size: 16px;">💳 Modalités de règlement par Transfert :</h3>
            <p style="margin-bottom: 12px;">Afin de garantir votre place et <strong>éviter le sold-out</strong>, nous vous recommandons vivement d'effectuer votre paiement à l'avance sur l'un des comptes suivants :</p>
            
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 14px;">
                <tr>
                    <td style="padding: 6px 0;">💛 <strong>MTN MoMo :</strong></td>
                    <td style="padding: 6px 0; font-family: monospace; font-size: 16px; font-weight: bold; color: #1E3A2B;">01 97 47 75 35</td>
                </tr>
                <tr>
                    <td style="padding: 6px 0;">💙 <strong>MOOV Money :</strong></td>
                    <td style="padding: 6px 0; font-family: monospace; font-size: 16px; font-weight: bold; color: #1E3A2B;">01 60 07 55 36</td>
                </tr>
                <tr>
                    <td style="padding: 6px 0;">💚 <strong>CELTIIS Cash :</strong></td>
                    <td style="padding: 6px 0; font-family: monospace; font-size: 16px; font-weight: bold; color: #1E3A2B;">01 43 18 23 13</td>
                </tr>
            </table>

            <p style="margin: 8px 0; font-size: 15px;"><strong>Nom du Bénéficiaire :</strong> <span style="background: #ffffff; padding: 3px 8px; border-radius: 4px; border: 1px solid #e2ece9; font-weight: bold; color: #1E3A2B;">Sènan FATON</span></p>

            <p style="margin-top: 12px; margin-bottom: 0; font-size: 13.5px; color: #8B5A2B;">
                <strong>📲 Confirmation :</strong> Dès votre transaction effectuée, veuillez envoyer la capture d'écran du transfert directement sur WhatsApp au <strong>01 43 18 23 13</strong> (+229 43 18 23 13).
            </p>
        </div>

        <p style="font-size: 13px; color: #5C6E66; font-style: italic;">
            * Note : Le paiement reste possible sur place le jour de l'événement, sous réserve des places et kits encore disponibles.
        </p>

        <div style="text-align: center; margin: 30px 0 10px 0;">
            <a href="{{whatsapp_link}}" style="background: #25D366; color: #ffffff; text-decoration: none; padding: 12px 25px; border-radius: 50px; font-weight: bold; display: inline-block;">
                Envoyer ma capture sur WhatsApp (43 18 23 13)
            </a>
        </div>
    </div>

    <div style="background: #F5EBE0; padding: 15px; text-align: center; font-size: 12px; color: #5C6E66;">
        Comité d'organisation JBAE 2026 • Cotonou, Bénin • Contact : gfaton251@gmail.com
    </div>
</div>
```

4. Cliquez sur **Save** et notez votre **Template ID** (ex: `template_jbae_confirm`).

---

### Étape 4 : Insérer vos clés dans `app.js`
Dans votre fichier [app.js](file:///c:/Users/Dell/Documents/JBAE%202026/app.js) (lignes 445-450), remplacez simplement les 3 valeurs :

```javascript
const EMAILJS_CONFIG = {
    PUBLIC_KEY: "VOTRE_PUBLIC_KEY",      // visible dans EmailJS > Account > Public Key
    SERVICE_ID: "service_xxxxxxx",        // votre Service ID de l'Étape 2
    TEMPLATE_ID: "template_xxxxxxx"       // votre Template ID de l'Étape 3
};
```

Dès cet instant, chaque visiteur recevra automatiquement son mail de confirmation dans sa boîte de réception !

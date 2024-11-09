import { db } from "@/server/db";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { type UserRank } from "@prisma/client";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import { type Adapter } from "next-auth/adapters";
import { decode, encode } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import DiscordProvider from "next-auth/providers/discord";

declare module "next-auth/jwt" {
	interface JWT {
		id: string;
		firstName: string;
		lastName: string;
		fullName: string;
		isAdmin: boolean;
		organizationId: string;
		phoneNumber: string;
		rank: UserRank;
	}
}

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
	interface Session extends DefaultSession {
		user: {
			id: string;
			// ...other properties
			// role: UserRole;
			firstName: string;
			lastName: string;
			fullName: string;
			isAdmin: boolean;
			organizationId: string;
			phoneNumber: string;
			rank: UserRank;
		} & DefaultSession["user"];
	}

	interface User {
		firstName: string;
		lastName: string;
		fullName: string;
		isAdmin: boolean;
		organizationId: string;
		phoneNumber: string;
		rank: UserRank;
	}
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
	// For development, credentials provider
	// only works in JWT mode (and not with DB sessions)
	session: {
		strategy: "jwt",
	},
	jwt: {
		encode,
		decode,
	},
	providers: [
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				userId: {
					label: "ID",
				},
			},
			authorize: async (credentials) => {
				console.log("@credentials phone number", credentials.userId);
				
				const user = await db.user.findUnique({
					where: {
						id: credentials.userId as string,
					},
				});
				
				console.log("user", user);
				
				if (user) {
					return {
						id: user.id,
						firstName: user.firstName,
						lastName: user.lastName,
						fullName: user.firstName + " " + user.lastName,
						isAdmin: user.isAdmin,
						organizationId: user.organizationId,
						phoneNumber: user.phoneNumber,
						rank: user.rank,
					};
				}

				return null;
			},
		}),
		DiscordProvider,
		/**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
	],
	adapter: PrismaAdapter(db) as Adapter,
	callbacks: {
		async jwt({ token, user }) {
			// If user object exists (i.e., after successful login), add user info to JWT
			if (user) {
				token.id = user.id;
				token.firstName = user.firstName;
				token.lastName = user.lastName;
				token.fullName = user.fullName;
				token.phoneNumber = user.phoneNumber;
				token.organizationId = user.organizationId;
				token.isAdmin = user.isAdmin;
				token.rank = user.rank;
				// token.email = user.email;
				// token.name = user.name;
			}

			return token; // Return the modified token
		},
		async session({ session, token }) {
			// Add user data from the token to the session
			if (token) {
				// session.user.id = token.id;
				// session.user.email = token.email;
				session.user.id = token.id;
				session.user.name = token.name;
				session.user.firstName = token.firstName;
				session.user.lastName = token.lastName;
				session.user.fullName = token.fullName;
				session.user.phoneNumber = token.phoneNumber;
				session.user.organizationId = token.organizationId;
				session.user.rank = token.rank;
				session.user.isAdmin = token.isAdmin;
			}

			return session; // Return the session with added user data
		},
		// session: ({ session, user }) => ({
		// 	...session,
		// 	user: {
		// 		...session.user,
		// 		id: user.id,
		// 	},
		// }),
	},
	debug: true,
} satisfies NextAuthConfig;

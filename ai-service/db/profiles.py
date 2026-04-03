"""
Profile Queries — Read User Data from Supabase

These functions fetch mariner profile and credential data.
The AI advisor needs this context to give personalized answers —
e.g., knowing someone holds an AB endorsement changes what
career paths and ship classes are relevant to them.
"""

import logging

from db.client import get_supabase_client

logger = logging.getLogger("civsail-ai.db.profiles")


async def get_user_profile(user_id: str) -> dict | None:
    """
    Fetch a mariner's full profile including their credentials.

    Returns a dict combining:
    - profiles table: name, contact, credential expirations, sector, department
    - credentials table: list of NMC endorsements (national, STCW, license)

    Returns None if the user_id doesn't exist in the profiles table.

    Why we combine both: The advisor agent needs to know both WHO the mariner
    is (profile) and WHAT they hold (credentials) to give accurate advice.
    A Third Mate asking about Chief Mate gets very different guidance than
    an OS asking about AB.
    """
    try:
        client = get_supabase_client()

        # Fetch the profile — select specific columns we need rather than *
        # to avoid pulling sensitive data we don't use
        profile_result = (
            client.table("profiles")
            .select(
                "user_id, full_name, email, ref_number, "
                "mmc_exp, medical_exp, passport_exp, twic_exp, license_exp, "
                "sector, department, contracting_company, career_track, "
                "nmc_verification_status, industry_entry_route, "
                "sea_days_per_year"
            )
            .eq("user_id", user_id)
            .execute()
        )

        if not profile_result.data:
            logger.info(f"No profile found for user_id={user_id}")
            return None

        profile = profile_result.data[0]

        # Fetch all credentials for this user
        credentials_result = (
            client.table("credentials")
            .select(
                "credential_type, endorsement_name, department, "
                "qualification_level, verified_by_nmc, issue_date"
            )
            .eq("user_id", user_id)
            .execute()
        )

        # Combine into a single dict — the advisor agent reads this
        # as one object in the AdvisorState
        profile["credentials"] = credentials_result.data or []

        logger.info(
            f"Loaded profile for user_id={user_id} "
            f"with {len(profile['credentials'])} credentials"
        )
        return profile

    except Exception as e:
        logger.error(f"Error fetching profile for user_id={user_id}: {e}")
        return None

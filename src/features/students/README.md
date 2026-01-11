# PDS Feature (Personal Data Sheet)

Reserved for future Personal Data Sheet form components and functionality.

## Status

**Currently empty** - This feature directory is prepared for future expansion.

## Purpose

The PDS feature will contain components and logic for:
- Government Personal Data Sheet forms
- Official documentation collection
- Administrative form handling

## Why Separate from Student Form?

While `student-form/` handles student enrollment workflows, `students/` will manage:
- Formal government documentation
- Standalone PDS forms not tied to enrollment
- Data sheet functionality that could be reused across different contexts

## Related

Address selection components are located in `client/features/student-form/` since they're primarily used for student enrollment.

## How to Use This Space

When ready to add PDS functionality:

1. Create components in `components/` subdirectory
2. Create types in `types/types.ts` if needed
3. Export from `index.ts` with barrel export pattern
4. Update this README with component descriptions

Follow the same architectural patterns as `student-form/` feature for consistency.

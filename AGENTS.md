# Agent Guidelines for Mexicano Games

## Context
This is a Padel Mexicano tournament management application. The app manages:
- Player registration and team assignment
- Match scoring with complex rules (deuce, golden ball, tie-breaks)
- Dynamic leaderboard and ranking system
- Automatic team generation based on rankings

## Key Rules to Respect

### Scoring System
- **Match Format**: First to 3 games wins
- **Game Points**: 0, 15, 30, 40, Game (or Deuce)
- **Deuce Rule**: 40-40 requires winning by 2 points
  - First deuce: Play ad-40/40-ad
  - Second deuce: Play golden ball (single deciding point)
- **Tie-break** (at 2-2 games):
  - Play to 7 points with 2-point margin (max 10 points)
  - At 9-9, receiver chooses which player receives serve
  - Serve order: First team serves left, second team serves 2 right, alternates

### Tournament Structure
- 8 players total
- 7 rounds (each with 2 matches)
- Team generation ensures no player pairs twice with same partner
- Rankings update after each match based on games won

## Development Priorities
1. **Bug Fixes**: Always prioritize fixing broken functionality
2. **Type Safety**: Use TypeScript - avoid any types
3. **UI/UX**: Follow existing design patterns and Tailwind conventions
4. **Performance**: Use memo/useCallback for expensive components
5. **Testing**: Verify changes work with sample tournaments

## Code Patterns
- Use custom hooks for state management (useTournament, useLocalStorage)
- Components should be pure functional components with React.FC
- Modal components should handle their own open/close state
- Styles use Tailwind classes - no inline styles except transitions

## Testing Checklist
Before committing changes:
- ✅ Build passes (`npm run build`)
- ✅ No TypeScript errors
- ✅ Rules are correctly implemented
- ✅ Leaderboard updates after match scoring
- ✅ Teams don't repeat players

## Common Tasks

### Adding a New Rule
1. Update rule display in `About.tsx`
2. Implement logic in `utils/mexicano.ts` if needed
3. Update score calculation in `useTournament.ts`
4. Test with sample tournament

### Fixing Score Logic
- Check `handleMatchScore` in `Tournament.tsx`
- Verify logic in `utils/mexicano.ts`
- Test edge cases (deuce, tie-break, golden ball)

### UI Changes
- Use existing component patterns
- Match color scheme (orange accents, slate grays)
- Test on different screen sizes
- Update corresponding About section if rules change
